import {Handler} from "../handler";

export class H8 extends Handler {
    network: Record<string, Node> = {};
    instructions: string = "";

    runA(input: string[]): string[] {
        this.instructions = input[0];
        for (let i = 1; i < input.length; i++) {
            const line = input[i];
            const match = RegExp(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/).exec(line);
            if (!match)
                throw Error("broski");
            this.network[match[1]] = new Node(match[1], match[2], match[3]);
        }

        let node = this.network["AAA"];
        let count = 0;
        let instructionIndex = 0;
        while (node.label != "ZZZ") {
            const instruction = this.instructions[instructionIndex];
            if (instruction == "L")
                node = this.network[node.left];
            else if (instruction == "R")
                node = this.network[node.right];
            else
                throw Error ("wtf");
            instructionIndex = (instructionIndex + 1) % this.instructions.length;
            count++;
        }

        return [count.toString()];
    }

    runB(input: string[]): string[] | undefined {
        return undefined;
    }

}

class Node {
    label: string;
    left: string;
    right: string;

    constructor(label: string, left: string, right: string) {
        if (!label || !left || !right)
            throw Error("knakker doe normi");
        this.label = label;
        this.left = left;
        this.right = right;
    }
}
