import type { Path } from './path.js';
import { Vec2 } from './vec2.js';

export class Bezier implements Path {
    constructor(public readonly points: readonly Vec2[]) {}

    static from(...points: Vec2[]): Bezier {
        return new Bezier(points);
    }

    getPoint(t: number): Vec2 {
        let points = this.points;
        while (points.length > 1) {
            const nextPoints = [];
            for (let i = 0; i < points.length - 1; i++) {
                nextPoints.push(points[i].lerp(points[i + 1], t));
            }
            points = nextPoints;
        }
        return points[0];
    }
}

export class SvgPath implements Path {
    constructor(public readonly svg: SVGPathElement) {}

    getPoint(t: number): Vec2 {
        const length = this.svg.getTotalLength();
        const point = this.svg.getPointAtLength(t * length);
        return new Vec2(point.x, point.y);
    }
}