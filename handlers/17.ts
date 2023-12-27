import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {
    bound,
    Direction,
    directionFromTo,
    fourAround,
    getShortestPathAStar,
    manhattanDistance, positionsEqual,
    stepsInDirection, sum
} from "../util";

export class H17 extends Handler {
    private grid: Grid<number>;

    constructor(input: string[]) {
        super(input);
        this.grid = new Grid(input.map(l => [...l].map(n => +n)));
    }

    runA(input: string[]): string[] {
        const start: CruciblePosition = { x: 0, y: 0, streak: 0 };
        const goal: CruciblePosition = { x: this.grid.colCount - 1, y: this.grid.rowCount - 1, streak: 0 };
        const path = getShortestPathAStar<CruciblePosition>(
            start,
            goal,
            cp => this.neighbours(cp),
            cp => manhattanDistance(cp, goal),
            (a, b, goal) => this.grid.getItem(b.x, b.y),
            (a, b) => positionsEqual(a, b) && a.going == b.going && a.streak == b.streak,
            positionsEqual);
        const total = sum(path.slice(1).map(cp => this.grid.getItem(cp.x, cp.y)));
        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        return undefined;
    }

    private neighbours(from: CruciblePosition): CruciblePosition[] {
        if (from.going == undefined) {
            const ns = fourAround(from.x, from.y)
                .map(([x, y]) => ({ x, y }))
                .map(pos => ({ x: pos.x, y: pos.y, going: directionFromTo(from, pos), streak: 1 }))
            return bound(ns, this.grid.colCount, this.grid.rowCount);
        }
        const ns = [stepsInDirection(from, from.going), stepsInDirection(from, (from.going - 1 + 4) % 4), stepsInDirection(from, (from.going + 1) % 4)];
        const filtered = bound(ns, this.grid.colCount, this.grid.rowCount);
        for (const cp of filtered) {
            if (cp.going == from.going)
                cp.streak++;
            else
                cp.streak = 1;
        }
        return filtered;
    }
}

interface CruciblePosition extends Position {
    going?: Direction;
    streak: number;
}
