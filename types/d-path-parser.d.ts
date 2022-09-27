declare module 'd-path-parser' {
    interface Point {
        x: number;
        y: number;
    }
    interface Command {
        code: string;
        value: number;
        end: Point;
        cp1: Point;
        cp2: Point;
        cp: Point;
        rotation: number;
        radii: Point;
        clockwise: boolean;
    }
    export default function parse(path: string): Command[];
}