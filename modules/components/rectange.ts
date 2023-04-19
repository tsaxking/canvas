class Rectangle extends CanvasElement {
    size: Size;

    constructor(position: XYZPoint, size: Size) {
        super(position);
        this.size = size;
    }

    public draw(canvas: Canvas): void {
        // draw this element
        canvas.context.beginPath();
        canvas.context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        canvas.context.stroke();
    }

    isIn(point: XYPoint): boolean {
        const x = this.position.x;
        const y = this.position.y;
        const w = this.size.width;
        const h = this.size.height;

        return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
    }

    isOut(point: XYPoint) {
        return !this.isIn(point);
    }
}
