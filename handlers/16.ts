import {Handler} from "../handler";
import {Direction, dirToStr, opposite, stepsInDirection} from "../util";
import {Grid} from "../util/grid";

export class H16 extends Handler {
    private readonly grid: Grid<Tile>;

    constructor(input: string[]) {
        super(input);
        this.grid = new Grid(input.map(l => [...l].map(Tile.Create)));
        Beam.maxX = this.grid.colCount;
        Beam.maxY = this.grid.rowCount;
    }

    runA(input: string[]): string[] {
        const beam = new Beam();
        this.runSimulation(beam);

        this.grid.printGrid(t => t.toChar());

        const total = this.grid.getItems().filter(t => t.energy > 0).length;

        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        const startingBeams: Beam[] = [];
        for (let x = 0; x < Beam.maxX; x++) {
            startingBeams.push(new Beam({ x, y: 0 }, Direction.Down));
            startingBeams.push(new Beam({ x, y: Beam.maxY - 1 }, Direction.Up));
        }
        for (let y = 0; y < Beam.maxY; y++) {
            startingBeams.push(new Beam({ x: 0, y }, Direction.Right));
            startingBeams.push(new Beam({ x: Beam.maxX - 1, y }, Direction.Left));
        }

        let maxE = -1;
        let done = 0;
        for (const beam of startingBeams) {
            for (const tile of this.grid.getItems())
                tile.resetEnergy();
            this.runSimulation(beam);
            const e = this.grid.getItems().filter(t => t.energy > 0).length;
            if (e > maxE)
                maxE = e;
            done++;
            console.log(`done ${done} / ${startingBeams.length}`);
        }

        return [maxE.toString()];
    }

    private runSimulation(beam: Beam) {
        this.grid.getItem(beam.pos.x, beam.pos.y).step(beam);
        const stack: Beam[] = [beam];
        while (stack.length > 0) {
            const beam = stack.shift();
            if (!beam)
                throw Error("kennie");
            const steps = beam.step(this.grid);
            stack.push(...steps);
        }
    }

}

class Beam {
    static maxX = -1;
    static maxY = -1;

    pos: Position;
    going: Direction;

    history: string[];

    constructor(pos?: Position, going?: Direction, history?: string[]) {
        this.pos = pos ?? { x: 0, y: 0 };
        this.going = going ?? Direction.Right;
        this.history = history ?? [];
    }

    step(grid: Grid<Tile>): Beam[] {
        const key = this.key();
        if (this.history.includes(key))
            return [];
        this.history.push(key);
        const newPos = stepsInDirection(this.pos, this.going);
        if (!(newPos.x >= 0 && newPos.x < Beam.maxX && newPos.y >= 0 && newPos.y < Beam.maxY)) {
            return [];
        }
        this.pos = newPos;
        return grid.getItem(newPos.x, newPos.y).step(this);
    }

    private key() {
        return `${this.pos.x},${this.pos.y},${this.going}`;
    }
}

abstract class Tile {
    private _energy: number = 0;
    private _energyDirection: Direction = 0;

    static Create(char: string): Tile {
        switch (char) {
            case ".": return new EmptyTile();
            case "/": return new Mirror(false);
            case "\\": return new Mirror(true);
            case "|": return new Splitter(false);
            case "-": return new Splitter(true);
            default: throw Error("whomst");
        }
    }

    get energy() { return this._energy; }
    get energyDirection() { return this._energyDirection; }

    protected abstract refract(beam: Beam): Beam[];
    protected abstract char(): string;

    step(beam: Beam): Beam[] {
        this.energise(beam.going);
        return this.refract(beam);
    }

    energise(direction: Direction, amount: number = 1) {
        this._energy += amount;
        this._energyDirection = direction;
    }

    resetEnergy() {
        this._energy = 0;
    }

    toChar(): string {
        if (this.energy == 0 || !(this instanceof EmptyTile))
            return this.char();
        if (this.energy == 1)
            return dirToStr(this.energyDirection);
        return this.energy.toString();
    }
}

class EmptyTile extends Tile {
    protected refract(beam: Beam): Beam[] {
        return [beam];
    }

    char(): string {
        return ".";
    }
}

class Mirror extends Tile {
    private readonly grave: boolean;

    constructor(grave: boolean) {
        super();
        this.grave = grave;
    }

    protected refract(beam: Beam): Beam[] {
        if ([Direction.Up, Direction.Down].includes(beam.going))
            beam.going = (beam.going + (this.grave ? -1 : 1) + 4) % 4;
        else
            beam.going = (beam.going + (this.grave ? 1 : -1) + 4) % 4;
        return [beam];
    }

    char(): string {
        return this.grave ? "\\" : "/";
    }
}

class Splitter extends Tile {
    private readonly horizontal: boolean;

    constructor(horizontal: boolean) {
        super();
        this.horizontal = horizontal;
    }

    protected refract(beam: Beam): Beam[] {
        if ([Direction.Up, Direction.Down].includes(beam.going) != this.horizontal)
            return [beam];
        beam.going = (beam.going + 1) % 4;
        const beam2 = new Beam({ x: beam.pos.x, y: beam.pos.y }, opposite(beam.going), beam.history);
        return [beam, beam2];
    }

    char(): string {
        return this.horizontal ? "-" : "|";
    }
}
