export abstract class Handler {
    protected input: string[];
    constructor(input: string[]) {
        if (!input[input.length - 1])
            input.splice(input.length - 1, 1);
        this.input = input;
    }
    abstract runA(input: string[]): string[];
    abstract runB(input: string[]): string[] | undefined;
}
