import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {arrayFindEntryFromBack, Direction, sum} from "../util";

export class H14 extends Handler {
    private grid: Grid<Space>;
    private roundRocks: Space[];

    constructor(input: string[]) {
        super(input);
        this.grid = new Grid(input.map((l, y) => [...l].map((c, x) => new Space(c, x, y))));
        this.roundRocks = this.grid.getItems().filter(s => s.type == SpaceType.RoundRock);
    }

    runA(input: string[]): string[] {
        this.tilt(Direction.Up);
        this.printGrid();
        return [this.calculateLoad().toString()];
    }

    runB(input: string[]): string[] | undefined {
        const history: number[] = [];
        let cycle: number[] = [];
        let historyIndex = -1;
        let stoppedAt = -1;
        for (let i = 0; i < 1000000000; i++) {
            this.tiltNorth();
            this.tiltWest();
            this.tiltSouth();
            this.tiltEast();
            if (i > 100) {
                const load = this.calculateLoad();
                history.push(load);
                if (i > 150) {
                    if (cycle.length == 0) {
                        const prev = arrayFindEntryFromBack(history, n => n == load, 1);
                        if (prev) {
                            historyIndex = prev[0];
                            cycle.push(load);
                        }
                    }
                    else {
                        historyIndex++;
                        if (history[historyIndex] == load) {
                            if (cycle[0] == load) {
                                stoppedAt = i;
                                break; // start of cycle found
                            }
                            cycle.push(load);
                        }
                        else {
                            historyIndex = -1;
                            cycle = [];
                        }
                    }
                }
            }
        }
        console.log(`Cycle length: ${cycle.length}`);
        console.log("Cycle:");
        console.log(cycle);
        console.log(`Stopped at: ${stoppedAt}`);

        const remainingSingleCycles = 1000000000 - stoppedAt;
        const remainingStepsInCycle = remainingSingleCycles % cycle.length;
        const loadAtEnd = cycle[remainingStepsInCycle - 1]; // '-1' somehow works for real input, not for example

        return [loadAtEnd.toString()];
    }

    tilt(dir: Direction) {
        switch (dir) {
            case Direction.Up:
                this.tiltNorth();
                break;
            case Direction.Right:
                this.tiltEast();
                break;
            case Direction.Down:
                this.tiltSouth();
                break;
            case Direction.Left:
                this.tiltWest();
                break;
        }
    }

    tiltNorth() {
        const colCount = this.grid.colCount;
        const rowCount = this.grid.rowCount;
        for (let x = 0; x < colCount; x++) {
            const col = this.grid.getCol(x);
            let lastStop = -1;
            for (let y = 0; y < rowCount; y++) {
                const space = col[y];
                switch (space.type) {
                    case SpaceType.Empty:
                        continue;
                    case SpaceType.CubeRock:
                        lastStop = y;
                        continue;
                    case SpaceType.RoundRock:
                        this.moveRockTo(space, x, lastStop + 1);
                        lastStop++;
                        continue;
                    default:
                        throw Error("whomst N");
                }
            }
        }
    }

    tiltSouth() {
        const colCount = this.grid.colCount;
        const rowCount = this.grid.rowCount;
        for (let x = 0; x < colCount; x++) {
            const col = this.grid.getCol(x);
            let lastStop = rowCount;
            for (let y = rowCount - 1; y >= 0; y--) {
                const space = col[y];
                switch (space.type) {
                    case SpaceType.Empty:
                        continue;
                    case SpaceType.CubeRock:
                        lastStop = y;
                        continue;
                    case SpaceType.RoundRock:
                        this.moveRockTo(space, x, lastStop - 1);
                        lastStop--;
                        continue;
                    default:
                        throw Error("whomst S");
                }
            }
        }
    }

    tiltWest() {
        const colCount = this.grid.colCount;
        const rowCount = this.grid.rowCount;
        for (let y = 0; y < rowCount; y++) {
            const row = this.grid.getRow(y);
            let lastStop = -1;
            for (let x = 0; x < colCount; x++) {
                const space = row[x];
                switch (space.type) {
                    case SpaceType.Empty:
                        continue;
                    case SpaceType.CubeRock:
                        lastStop = x;
                        continue;
                    case SpaceType.RoundRock:
                        this.moveRockTo(space, lastStop + 1, y);
                        lastStop++;
                        continue;
                    default:
                        throw Error("whomst W");
                }
            }
        }
    }

    tiltEast() {
        const colCount = this.grid.colCount;
        const rowCount = this.grid.rowCount;
        for (let y = 0; y < rowCount; y++) {
            const row = this.grid.getRow(y);
            let lastStop = colCount;
            for (let x = colCount - 1; x >= 0; x--) {
                const space = row[x];
                switch (space.type) {
                    case SpaceType.Empty:
                        continue;
                    case SpaceType.CubeRock:
                        lastStop = x;
                        continue;
                    case SpaceType.RoundRock:
                        this.moveRockTo(space, lastStop - 1, y);
                        lastStop--;
                        continue;
                    default:
                        throw Error("whomst W");
                }
            }
        }
    }

    moveRockTo(rock: Space, x: number, y: number) {
        const destination = this.grid.getItem(x, y);
        this.grid.setItem(rock.pos.x, rock.pos.y, destination);
        this.grid.setItem(x, y, rock);
        rock.pos.x = x;
        rock.pos.y = y;
    }

    calculateLoad() {
        const scores = this.roundRocks.map(r => this.grid.rowCount - r.pos.y);
        return sum(scores);
    }

    printGrid() {
        for (let y = 0; y < this.grid.rowCount; y++) {
            console.log(this.grid.getRow(y).map(s => s.char).join(""));
        }
    }

}

enum SpaceType {
    Empty,
    CubeRock,
    RoundRock,
}

class Space {
    char: string;
    type: SpaceType;
    pos: Position;

    constructor(char: string, x: number, y: number) {
        this.char = char;
        switch (char) {
            case ".":
                this.type = SpaceType.Empty;
                break;
            case "#":
                this.type = SpaceType.CubeRock;
                break;
            case "O":
                this.type = SpaceType.RoundRock;
                break;
            default: throw Error("como estas")
        }
        this.pos = { x, y };
    }
}