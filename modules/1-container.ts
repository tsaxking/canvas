class Container implements Drawable {
    elements: (CanvasElement|SubCanvas)[] = [];

    constructor() {
    }

    public addElement(element: CanvasElement|SubCanvas): void {
        this.elements.push(element);
    }

    public removeElement(element: CanvasElement|SubCanvas): void {
        const index = this.elements.indexOf(element);
        if (index > -1) this.elements.splice(index, 1);
    }

    public draw(canvas: Canvas): void {
        this.sort();
        this.elements.forEach((e, i) => {
            if (e instanceof CanvasImage && !e.image && !canvas.animating && i !== this.elements.length - 1) {
                console.warn('Image has not loaded, and animation is not running. This may cause the image to render over other elements');
            }

            canvas.context.save();
            e.draw(canvas);
            canvas.context.restore();
        });
    }

    public sort() {
        // sort elements by z-index
        this.elements.sort((a, b) => {
            const aPos = a.position;
            const bPos = b.position;
            return aPos.z - bPos.z;
        });
    }
}