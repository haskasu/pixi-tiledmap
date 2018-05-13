import tiledMapLoader from './tiledMapLoader';
import TiledMap from './TiledMap';
import TileSet from './TileSet';
import Tile from './Tile';
import TileLayer from './TileLayer';
import ImageLayer from './ImageLayer';
import tmx from 'tmx-parser';

PIXI.loaders.Loader.addPixiMiddleware(tiledMapLoader);
PIXI.loader.use(tiledMapLoader());

export default PIXI.extras.tiled = {
    TiledMap: TiledMap,
    TileSet: TileSet,
    Tile: Tile,
    TileLayer: TileLayer,
    ImageLayer: ImageLayer,
    tmx: tmx
};