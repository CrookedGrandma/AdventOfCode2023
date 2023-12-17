export abstract class Handler {
    protected input: string[];
    constructor(input: string[]) {
        this.input = input;
    }
    abstract runA(input: string[]): string[];
    abstract runB(input: string[]): string[] | undefined;
}
