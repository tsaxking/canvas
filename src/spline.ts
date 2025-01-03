import { Drawable } from './drawable';
import { Spline as S } from 'math/spline';

type SplineOptions = {
    frames: number;
};

export class Spline extends Drawable<Spline> {
    constructor(
        public readonly spline: S,
        public readonly options: Partial<SplineOptions> = {}
    ) {
        super();
    }

    isIn(_point: [number, number]): boolean {
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const { width, height } = ctx.canvas;
        ctx.fillStyle = this.properties.fill?.color || 'black';
        ctx.strokeStyle = this.properties.line?.color || 'black';

        ctx.beginPath();
        let { x, y } = this.spline.ft(0);
        [x, y] = this.reflect([x, y]);
        ctx.moveTo(x * width, y * height);

        const frames = this.options.frames || 100;
        for (let i = 1; i <= frames; i++) {
            const { x, y } = this.spline.ft(i / frames);
            ctx.lineTo(x * width, y * height);
        }
        ctx.stroke();
    }
}
