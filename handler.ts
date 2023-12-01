export abstract class Handler {
    abstract runA(input: string[]): string[];
    abstract runB(input: string[]): string[] | undefined;
}
