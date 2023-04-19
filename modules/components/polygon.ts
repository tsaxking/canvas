class Polygon extends CanvasElement {
    #points: XYPoint[] = [];

    constructor(position: XYZPoint, points: XYPoint[]) {
        super(position);

        this.points = points;
    }

    get points(): XYPoint[] {
        return this.#points;
    }

    set points(value: XYPoint[]) {
        if (!Array.isArray(value)) throw new Error('Points must be an array of XYPoints.');

        value = value.map(p => new TwoDPoint(p));

        this.#points = value;
    }

    public draw(canvas: Canvas): void {
        // draw this element
        const point1 = this.points[0];

        canvas.context.beginPath();
        canvas.context.moveTo(point1.x, point1.y);

        this.points.forEach((p, i) => {
            if (!i) return;
            canvas.context.lineTo(p.x, p.y);
        });

        canvas.context.lineTo(point1.x, point1.y);

        canvas.context.closePath();
        canvas.context.stroke();
    }

    isIn(point: XYPoint): boolean {
        // test if point is inside the box using ray casting
        let inside = false;

        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const x1 = this.points[i].x;
            const y1 = this.points[i].y;
            const x2 = this.points[j].x;
            const y2 = this.points[j].y;

            const intersect = ((y1 > point.y) != (y2 > point.y)) && (point.x < (x2 - x1) * (point.y - y1) / (y2 - y1) + x1);

            if (intersect) inside = !inside;
        }

        // inside && !this.entered && this.onEnter();
        // !inside && this.entered && this.onExit();
        // this.entered = inside;

        return inside;
    }

    isOut(point: XYPoint) {
        return !this.isIn(point);
    }
}