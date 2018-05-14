import TmxLoader from './TmxLoader';
import TiledMap from './TiledMap';
import TileSet from './TileSet';
import Tile from './Tile';
import TileLayer from './TileLayer';
import ImageLayer from './ImageLayer';
import tmx from 'tmx-parser';

PIXI.loaders.Loader.addPixiMiddleware(TmxLoader.pixiMiddleware);
PIXI.loader.use(TmxLoader.pixiMiddleware());

export default PIXI.extras.tiled = {
    TiledMap: TiledMap,
    TileSet: TileSet,
    Tile: Tile,
    TileLayer: TileLayer,
    ImageLayer: ImageLayer,
    TmxLoader: TmxLoader,
    tmx: tmx
};