import path from 'path';
import url from 'url';
import tmx from 'tmx-parser';

export default class TmxLoader {

    parseRoute(loader, tmxUrl) {
        return path.dirname(tmxUrl.replace(loader.baseUrl, ''));
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
        xmlHttp.open("GET", name, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    static pixiMiddleware() {
        return function (resource, next) {

            if (!resource.data ||
                resource.type !== PIXI.loaders.Resource.TYPE.XML ||
                !resource.data.children[0].getElementsByTagName('tileset')) {
                return next();
            }

            var tmxLoader = new TmxLoader();
            const route = tmxLoader.parseRoute(this, resource.url);
            const loadOptions = tmxLoader.getImageLoadOptions(resource);

            tmx.readFile = (name, cb) => {
                tmxLoader.readFile(name, cb);
            };

            tmx.resolveTileSet = (unresolvedTileSet, cb) => {
                var target = url.resolve(pathToDir, unresolvedTileSet.source);
                tmx.parseFile(target, function (err, resolvedTileSet) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    resolvedTileSet.mergeTo(unresolvedTileSet);
                    cb();
                });
            };

            tmx.parse(resource.xhr.responseText, resource.url, (err, map) => {
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