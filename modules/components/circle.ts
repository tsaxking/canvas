class Circle extends CanvasElement {
    radius: number;

    constructor(position: XYZPoint, radius: number) {
        super(position);
        this.radius = radius;
    }

    public draw(canvas: Canvas): void {
        // draw this element
        canvas.context.beginPath();
        canvas.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        canvas.context.stroke();
    }

    isIn(point: XYPoint): boolean {
        const dist = Math.sqrt((point.x - this.position.x) ** 2 + (point.y - this.position.y) ** 2);

        return dist <= this.radius;
    }

    isOut(point: XYPoint) {
        return !this.isIn(point);
    }
}