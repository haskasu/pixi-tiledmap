export default class TileSet {
    constructor(route, tileSet) {
        Object.assign(this, tileSet);

        this.baseTexture = this.createBaseTexture(route, tileSet.image.source);
        this.textures = [];

        for (let y = this.margin; y < this.image.height; y += this.tileHeight + this.spacing) {
            for (let x = this.margin; x < this.image.width; x += this.tileWidth + this.spacing) {
                this.textures.push(new PIXI.Texture(this.baseTexture, new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight)));
            }
        }
    }

    createBaseTexture(route, source) {
        return PIXI.Texture.fromImage(route + '/' + source, false, PIXI.SCALE_MODES.NEAREST);
    }
}