import path from 'path';
import tmx from 'tmx-parser';

export default () => {
    return function (resource, next) {

        if (!resource.data ||
            resource.type !== PIXI.loaders.Resource.TYPE.XML ||
            !resource.data.children[0].getElementsByTagName('tileset')) {
            return next();
        }

        const route = path.dirname(resource.url.replace(this.baseUrl, ''));

        const loadOptions = {
            crossOrigin: resource.crossOrigin,
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            parentResource: resource
        };

        tmx.parse(resource.xhr.responseText, route, (err, map) => {
            if (err) throw err;

            map.tileSets.forEach(tileset => {
                if (!(tileset.image.source in this.resources)) {
                    if(tileset.image.source.test(/^(http:\/\/|https:\/\/)/)) {
                        this.add(tileset.image.source, tileset.image.source, loadOptions);                        
                    } else {
                        this.add(tileset.image.source, `${route}/${tileset.image.source}`, loadOptions);
                    }
                }
            });

            resource.data = map;
            next();
        });
    };
};