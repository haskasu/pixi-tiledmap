import * as PIXI from 'pixi.js';
import 'pixi-tiledmap';

const renderer = PIXI.autoDetectRenderer(442, 286);
document.body.appendChild(renderer.view);

/**
 * Simply load a Tiled map in TMX format like a usual resource
 */
PIXI.loader
    .add('assets/01_basement.tmx')
    .load(() => {
        /**
         *   PIXI.extras.TiledMap() is an extended PIXI.Container()
         *   so you can render it right away
         */
        //const tileMap = new PIXI.extras.tiled.TiledMap(PIXI.loader.resources['assets/01_basement.tmx']);
        const tileMap = new PIXI.extras.tiled.TiledMap(PIXI.loader.resources['assets/01_basement.tmx']);
        renderer.render(tileMap);
    });