export class Grid<T> {
    private readonly rows: T[][];
    private readonly columns: T[][];

    constructor(rows: T[][]) {
        this.rows = rows;
        this.columns = rows[0].map((_, iCol) => rows.map(row => row[iCol]));
    }

    getRow(i: number) {
        return this.rows[i];
    }

    getCol(i: number) {
        return this.columns[i];
    }

    getItem(iCol: number, iRow: number) {
        return this.rows[iRow][iCol];
    }

    setItem(iCol: number, iRow: number, value: T) {
        this.rows[iRow][iCol] = value;
        this.columns[iCol][iRow] = value;
    }

    get rowCount() {
        return this.rows.length;
    }

    get colCount() {
        return this.columns.length;
    }

    get itemCount() {
        return this.colCount * this.rowCount;
    }
}