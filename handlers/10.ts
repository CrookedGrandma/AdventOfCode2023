import {Handler} from "../handler";
import {Direction, fourAround, maxBy, opposite} from "../util";

export class H10 extends Handler {
    private startPipe: Pipe = undefined as unknown as Pipe;
    private cyclePipes: Pipe[] = [];

    runA(input: string[]): string[] {
        const startY = input.findIndex(line => line.includes("S"));
        const startX = input[startY].indexOf("S");
        this.startPipe = new Pipe(startX, startY, "S");

        this.findCycle(this.startPipe, this.cyclePipes, input);
        this.setDistances(this.cyclePipes);

        // const maxDist = maxBy(this.cyclePipes, p => p.distance).distance;
        const maxDist = Math.floor((this.cyclePipes.length + 1) / 2);

        return [maxDist.toString()];
    }

    runB(input: string[]): string[] | undefined {
        return undefined;
    }

    findCycle(startPipe: Pipe, cycleArray: Pipe[], input: string[]) {
        const firstPos = this.getFirstOfCycle(startPipe, input);
        const firstPipe = new Pipe(firstPos.p.x, firstPos.p.y, firstPos.c, startPipe);
        startPipe.setNext(firstPipe);
        cycleArray.push(firstPipe);
        let pipe = firstPipe;
        let prevX = startPipe.x;
        let prevY = startPipe.y;
        while (true) {
            const nextPos = this.getNextPipePosition(pipe, prevX, prevY, input);
            if (nextPos.c == "S")
                break;
            const nextPipe = new Pipe(nextPos.p.x, nextPos.p.y, nextPos.c, pipe);
            pipe.setNext(nextPipe);
            cycleArray.push(nextPipe);
            prevX = pipe.x;
            prevY = pipe.y;
            pipe = nextPipe;
        }
        startPipe.setPrevious(pipe);
    }

    setDistances(cycle: Pipe[]) {
        const length = cycle.length;
        const half = length / 2;
        for (let i = 0; i < length; i++) {
            const d = Math.min(i + 1, length - i);
            if (d < 1 || d > half + .5)
                throw Error("bru");
            cycle[i].distance = d;
        }
    }

    getFirstOfCycle(startPipe: Pipe, input: string[]) {
        const pipe = startPipe;
        const neighbours = fourAround(pipe.x, pipe.y)
            .filter(([fx, fy]) => fx >= 0 && fx < input[0].length && fy >= 0 && fy < input.length)
            .map(([fx, fy]) => ({char: input[fy][fx], dir: this.direction(fx, fy, pipe.x, pipe.y), fx, fy}))
            .filter(({ char, dir }) => matches(char, dir));
        if (neighbours.length == 0)
            throw Error(`no neighbours found at (${pipe.x}, ${pipe.y})`);
        const n = neighbours[0];
        return { p: { x: n.fx, y: n.fy }, c: n.char };
    }

    getNextPipePosition(pipe: Pipe, prevX: number, prevY: number, input: string[]): { p: Position, c: string } {
        const neighbours = fourAround(pipe.x, pipe.y)
            .filter(([fx, fy]) => fx >= 0 && fx < input[0].length && fy >= 0 && fy < input.length && !(fx == prevX && fy == prevY))
            .map(([fx, fy]) => ({ fx, fy, dir: this.direction(fx, fy, pipe.x, pipe.y) }))
            .filter(({ dir }) => pipe.canGo(dir))
            .map(({ fx, fy, dir }) => ({char: input[fy][fx], dir, fx, fy}));
        if (neighbours.length == 0)
            throw Error(`no neighbours found at (${pipe.x}, ${pipe.y})`);
        if (neighbours.length > 1)
            throw Error(`too many neighbours found at (${pipe.x}, ${pipe.y})`);
        const n = neighbours[0];
        return { p: { x: n.fx, y: n.fy }, c: n.char };
    }

    direction(x: number, y: number, prevX: number, prevY: number): Direction {
        const diffX = x - prevX;
        if (diffX > 1 || diffX < -1)
            throw Error("huh");
        if (diffX != 0)
            return diffX == 1 ? Direction.Right : Direction.Left;
        const diffY = y - prevY;
        if (diffY > 1 || diffY < -1)
            throw Error("uhu");
        if (diffY != 0)
            return diffY == 1 ? Direction.Down : Direction.Up;
        throw Error("huhuhu");
    }

}

function matches(char: string, going: Direction) {
    if (char == "S")
        return true;

    if (going == Direction.Up)
        return ["|", "7", "F"].includes(char);
    if (going == Direction.Right)
        return ["-", "J", "7"].includes(char);
    if (going == Direction.Down)
        return ["|", "L", "J"].includes(char);
    if (going == Direction.Left)
        return ["-", "L", "F"].includes(char);

    throw Error("ayo what kind of pipe is this");
}

class Pipe {
    x: number;
    y: number;
    char: string;

    isStartPipe: boolean;

    distance: number = -1;

    private next?: Pipe;
    private previous?: Pipe;

    constructor(x: number, y: number, char: string, previous?: Pipe) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.isStartPipe = char == "S";
        this.previous = previous;
    }

    canGo(going: Direction): boolean {
        return matches(this.char, opposite(going));
    }

    setPrevious(pipe: Pipe) {
        this.previous = pipe;
    }

    setNext(pipe: Pipe) {
        this.next = pipe;
    }

    getPrevious() {
        if (!this.previous)
            throw Error("vorige pijp afwezig oeioei");
        return this.previous;
    }

    getNext() {
        if (!this.next)
            throw Error("volgende pijp? more like die bestaat niet haha gottem");
        return this.next;
    }
}
