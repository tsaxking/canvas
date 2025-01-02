import { Point } from 'math/src/linear-algebra/point';
import { Drawable } from './drawable';

export class Sphere extends Drawable<Sphere> {
    constructor(
        public readonly center: Point,
        public readonly radius: number
    ) {
        super();
    }
}
