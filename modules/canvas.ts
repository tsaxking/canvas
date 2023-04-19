class Canvas extends Container {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    animating: boolean = false;
    frames: number = 0;
    fps: number = 0;
    startDate: number = 0;

    constructor(canvas: HTMLCanvasElement, options: CanvasOptions) {
        super();

        this.canvas = canvas;
        this.size = options.size;

        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
    }

    get size(): Size {
        return {width: this.canvas.width, height: this.canvas.height};
    }

    set size(value: Size) {
        this.canvas.width = value.width;
        this.canvas.height = value.height;
    }

    public animate(): void {
        requestAnimationFrame(() => {
            this.draw(this);
            this.frames++;
            this.fps = Math.round(this.frames / ((Date.now() - this.startDate) / 1000));
            if (this.animating) this.animate();
        });
    }

    public start() {
        this.startDate = Date.now();
        this.animating = true;
        this.animate();
    }

    public stop(): void {
        this.animating = false;
    }
}