class CanvasElement implements Drawable {
    #position: XYZPoint = {x: 0, y: 0, z: 0};
    #visible: boolean;

    constructor(position: XYZPoint) {
        this.position = position;
        this.#visible = true;
    }

    get position(): XYZPoint {
        return this.#position;
    }

    set position(value: XYZPoint) {
        value = new ThreeDPoint(value);

        this.#position = value;
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(value: boolean) {
        if (value) this.show();
        else this.hide();
    }


    public hide() {
        this.#visible = false;
    }
    
    public show() {
        this.#visible = true;
    }


    public draw(canvas: Canvas): void {
        // draw this element
    }

    public moveTo(point: XYZPoint): void {
        this.position = point;
    }
}