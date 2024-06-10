import type { Path2 } from "@omujs/flat/property/path2.js";
import type { Vec2 } from "@omujs/flat/property/vec2.js";

export class Bezier {
    private path: Path2;

    constructor(path: Path2) {
        this.path = path;
    }

    public getPoint(t: number): Vec2 {
        let points = [...this.path];
        while (points.length > 1) {
            const newPoints = [];
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const x = p1.x + (p2.x - p1.x) * t;
                const y = p1.y + (p2.y - p1.y) * t;
                newPoints.push({ x, y });
            }
            points = newPoints;
        }
        return points[0];
    }
}