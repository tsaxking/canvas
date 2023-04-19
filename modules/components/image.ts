class CanvasImage extends CanvasElement {
    src: string;
    image: HTMLImageElement|undefined;

    constructor(src: string, position: XYZPoint) {
        super(position);
        this.src = src;
    }

    private async load(): Promise<HTMLImageElement> {
        return new Promise(async(res,rej) => {
            const image = new Image();
            image.src = this.src;
            image.onload = () => res(image);
            image.onerror = () => rej();
        });
    }

    public async draw(canvas: Canvas) {
        if (!this.image) this.image = await this.load();
        const pos = this.position;
        canvas.context.drawImage(this.image, pos.x, pos.y);
    }
}