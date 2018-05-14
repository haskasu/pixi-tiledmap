import path from 'path';
import tmx from 'tmx-parser';

export default class TmxLoader {

    getImageLoadOptions(resource) {
        return {
            crossOrigin: resource.crossOrigin,
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            parentResource: resource
        };
    }

    onLoadTileset(loader, route, tileset, loadOptions) {
        if (!(tileset.image.source in loader.resources)) {
            loader.add(tileset.image.source, `${route}/${tileset.image.source}`, loadOptions);
        }
    }

    static pixiMiddleware() {
        return function (resource, next) {

            if (!resource.data ||
                resource.type !== PIXI.loaders.Resource.TYPE.XML ||
                !resource.data.children[0].getElementsByTagName('tileset')) {
                return next();
            }
   
            var tmxLoader = new TmxLoader();
            const route = path.dirname(resource.url.replace(this.baseUrl, ''));
            const loadOptions = tmxLoader.getImageLoadOptions(resource);
    
            tmx.parse(resource.xhr.responseText, route, (err, map) => {
                if (err) throw err;
    
                map.tileSets.forEach(tileset => {
                    tmxLoader.onLoadTileset(this, route, tileset, loadOptions);
                });
    
                resource.data = map;
                next();
            });
        };
    }
}