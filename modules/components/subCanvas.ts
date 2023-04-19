class SubCanvas { // "CanvasElement"
    element: CanvasElement;
    container: Container;

    constructor(element: CanvasElement, container: Container) {
        this.element = element;
        this.container = container;
    }


    get position(): XYZPoint {
        return this.element.position;
    }

    set position(value: XYZPoint) {
        this.element.position = value;

        this.container.elements.forEach(e => {
            e.position = {
                x: this.position.x + e.position.x,
                y: this.position.y + e.position.y,
                z: this.position.z + e.position.z
            }
        });
    }

    public moveTo(point: XYZPoint): void {
        this.position = point;
    }



    get visible(): boolean {
        return this.element.visible;
    }

    set visible(value: boolean) {
        this.element.visible = value;
    }

    public hide() {
        this.element.hide();

        this.container.elements.forEach(e => {
            e.hide();
        });
    }

    public show() {
        this.element.show();

        this.container.elements.forEach(e => {
            e.show();
        });
    }

    public draw(canvas: Canvas): void {
        this.element.draw(canvas);

        this.container.draw(canvas);
    }

    public addElement(element: CanvasElement|SubCanvas): void {
        element.position = {
            x: this.position.x + element.position.x,
            y: this.position.y + element.position.y,
            z: this.position.z + element.position.z
        }

        this.container.addElement(element);
    }

    public removeElement(element: CanvasElement|SubCanvas): void {
        this.container.removeElement(element);

        element.position = {
            x: element.position.x - this.position.x,
            y: element.position.y - this.position.y,
            z: element.position.z - this.position.z
        }
    }
}