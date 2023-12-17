import {Handler} from "../handler";
import {getDistinctPairs, manhattanDistance, positionsEqual} from "../util";

export class H11 extends Handler {
    private galaxies: Galaxy[] = [];

    constructor(input: string[]) {
        super(input);

        this.getGalaxies(input);
    }

    runA(input: string[]): string[] {
        for (const g of this.galaxies)
            g.expand(2);

        const pairs = getDistinctPairs(this.galaxies);
        let total = 0;
        for (const [a, b] of pairs) {
            total += manhattanDistance(a.pos, b.pos);
        }

        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        this.getGalaxies(input);
        for (const g of this.galaxies)
            g.expand(1000000);

        const pairs = getDistinctPairs(this.galaxies);
        let total = 0;

        for (const [a, b] of pairs) {
            total += manhattanDistance(a.pos, b.pos);
        }

        return [total.toString()];
    }

    getGalaxies(input: string[]) {
        this.galaxies = [];
        for (let y = 0; y < input.length; y++) {
            const line = input[y];
            for (let x = 0; x < line.length; x++) {
                const char = input[y][x];
                if (char == "#") {
                    const g = new Galaxy(this.galaxies.length, { x, y });
                    this.galaxies.push(g);
                }
            }
        }

        // Duplicate empty columns
        for (let x = 0; x < input[0].length; x++) {
            if (!input.every(line => line[x] == "."))
                continue;

            const gs = this.galaxies.filter(g => g.pos.x > x);
            for (const g of gs)
                g.timesExpandX++;
        }

        // Duplicate empty rows
        for (let y = 0; y < input.length; y++) {
            const line = input[y];
            if (/^\.+$/.test(line)) {
                const gs = this.galaxies.filter(g => g.pos.y > y);
                for (const g of gs)
                    g.timesExpandY++;
            }
        }
    }
}

class Galaxy {
    id: number;
    pos: Position;

    timesExpandX: number = 0;
    timesExpandY: number = 0;

    constructor(id: number, pos: Position) {
        this.id = id;
        this.pos = pos;
    }

    expand(width: number) {
        this.pos.x += (width - 1) * this.timesExpandX;
        this.pos.y += (width - 1) * this.timesExpandY;
    }
}
