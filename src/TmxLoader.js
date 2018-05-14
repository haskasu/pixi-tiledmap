import path from 'path';
import tmx from 'tmx-parser';

export default class TmxLoader {

    constructor(tmxUrl) {
        this.route = this.parseRoute(tmxUrl);
    }

    parseRoute(tmxUrl) {
        return path.dirname(tmxUrl.replace(this.baseUrl, ''));
    }

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

    readFile(name, cb) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                cb(null, xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", `${this.route}/${name}`, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    static pixiMiddleware() {
        return function (resource, next) {

            if (!resource.data ||
                resource.type !== PIXI.loaders.Resource.TYPE.XML ||
                !resource.data.children[0].getElementsByTagName('tileset')) {
                return next();
            }

            var tmxLoader = new TmxLoader(resource.url);
            const route = tmxLoader.route;
            const loadOptions = tmxLoader.getImageLoadOptions(resource);

            tmx.readFile = (name, cb) => {
                tmxLoader.readFile(name, cb);
            };

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