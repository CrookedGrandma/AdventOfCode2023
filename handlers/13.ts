import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {arraysEqual} from "../util";

export class H13 extends Handler {
    private grids: Grid<string>[] = [];
    private reflectionValues: number[] = [];

    constructor(input: string[]) {
        super(input);
        let rows: string[][] = [];
        for (const line of input) {
            if (!line) {
                this.grids.push(new Grid(rows));
                rows = [];
            }
            else {
                rows.push([...line]);
            }
        }
        this.grids.push(new Grid(rows));
    }

    runA(input: string[]): string[] {
        let total = 0;
        for (const grid of this.grids) {
            const value = this.findReflectionValue(grid);
            if (value === false)
                throw Error("https://youtu.be/xVWeRnStdSA");
            this.reflectionValues.push(value);
            total += value;
        }
        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        let total = 0;
        for (const [i, grid] of this.grids.entries()) {
            const prevValue = this.reflectionValues[i];
            const rowCount = grid.rowCount;
            const colCount = grid.colCount;
            let found = false;
            for (let y = 0; y < rowCount; y++) {
                for (let x = 0; x < colCount; x++) {
                    const item = grid.getItem(x, y);
                    const opposite = item == "." ? "#" : ".";
                    grid.setItem(x, y, opposite);
                    const values = this.findReflectionValues(grid);
                    const value = values.find(v => v != prevValue);
                    if (value !== undefined) {
                        total += value;
                        found = true;
                        break;
                    }
                    grid.setItem(x, y, item);
                }
                if (found)
                    break;
            }
            if (!found)
                throw Error("https://youtu.be/xVWeRnStdSA");
        }
        return [total.toString()];
    }

    findReflectionValues(grid: Grid<string>) {
        const values: number[] = [];
        const value1 = this.findReflectionValue(grid);
        if (value1 !== false) {
            values.push(value1);
        const value2 = this.findReflectionValue(grid, value1);
            if (value2 !== false)
                values.push(value2);
        }
        return values;
    }

    findReflectionValue(grid: Grid<string>, valueCannotBe: number = 0) {
        const rowCount = grid.rowCount;
        for (let y = 1; y < rowCount; y++) {
            const maxDy = Math.min(y - 1, rowCount - y - 1);
            let foundAtY = true;
            for (let dy = 0; dy <= maxDy; dy++) {
                if (!arraysEqual(grid.getRow(y + dy), grid.getRow(y - dy - 1))) {
                    foundAtY = false;
                    break;
                }
            }
            if (foundAtY && 100 * y != valueCannotBe)
                return 100 * y;
        }

        const colCount = grid.colCount;
        for (let x = 1; x < colCount; x++) {
            const maxDx = Math.min(x - 1, colCount - x - 1);
            let foundAtX = true;
            for (let dx = 0; dx <= maxDx; dx++) {
                if (!arraysEqual(grid.getCol(x + dx), grid.getCol(x - dx - 1))) {
                    foundAtX = false;
                    break;
                }
            }
            if (foundAtX && x != valueCannotBe)
                return x;
        }

        return false;
    }

}