import {Handler} from "../handler";
import {sum} from "../util";

interface Instruction {
    full: string;
    label: string;
    placing: boolean;
    digit?: number;
}

interface Lens {
    label: string;
    box: number;
    focalLength: number;
}

export class H15 extends Handler {
    private readonly line: string;
    private readonly instructions: Instruction[];
    private readonly boxes: Lens[][];

    constructor(input: string[]) {
        super(input);
        this.line = input[0];
        this.instructions = this.line.split(",").map(i => {
            const equals = i.includes("=");
            if (equals) {
                const split = i.split("=");
                return {
                    full: i,
                    label: split[0],
                    placing: true,
                    digit: +split[1],
                };
            }
            const split = i.split("-");
            return {
                full: i,
                label: split[0],
                placing: false,
            };
        });
        this.boxes = [...Array(256)].map(e => Array(0));
    }

    runA(input: string[]): string[] {
        const hashes = this.instructions.map(i => this.hash(i.full));
        const total = sum(hashes);
        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        for (const i of this.instructions) {
            const hash = this.hash(i.label);
            const box = this.boxes[hash];
            const index = box.findIndex(l => l.label == i.label);
            if (i.placing) {
                const newBox = {
                    label: i.label,
                    box: hash,
                    focalLength: i.digit as number,
                };
                if (index >= 0)
                    box.splice(index, 1, newBox);
                else
                    box.push(newBox);
            }
            else {
                if (index < 0)
                    continue;
                box.splice(index, 1);
            }
        }

        let total = 0;
        for (const box of this.boxes) {
            for (let i = 0; i < box.length; i++) {
                const lens = box[i];
                total += (1 + lens.box) * (i + 1) * lens.focalLength;
            }
        }

        return [total.toString()];
    }

    private hash(input: string) {
        let value = 0;
        for (let i = 0; i < input.length; i++) {
            const ascii = input.charCodeAt(i);
            value += ascii;
            value *= 17;
            value %= 256;
        }
        return value;
    }

}
