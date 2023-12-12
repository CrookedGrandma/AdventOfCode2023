import {Handler} from "../handler";
import {leastCommonMultipleArray} from "../util";

export class H8 extends Handler {
    network: Record<string, Node> = {};
    instructions: string = "";
    startNodes: Node[] = [];

    runA(input: string[]): string[] {
        this.instructions = input[0];
        for (let i = 1; i < input.length; i++) {
            const line = input[i];
            const match = RegExp(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/).exec(line);
            if (!match)
                throw Error("broski");
            const node = new Node(match[1], match[2], match[3]);
            this.network[match[1]] = node;
            if (node.label.endsWith("A"))
                this.startNodes.push(node);
        }

        let node = this.network["AAA"];
        let count = 0;
        let instructionIndex = 0;
        while (node.label != "ZZZ") {
            const instruction = this.instructions[instructionIndex];
            node = node.step(instruction, this.network);
            instructionIndex = (instructionIndex + 1) % this.instructions.length;
            count++;
        }

        return [count.toString()];
    }

    runB(input: string[]): string[] | undefined {
        const steps: number[] = [];
        for (const startNode of this.startNodes) {
            let node = startNode;
            let count = 0;
            let instructionIndex = 0;
            while (!node.label.endsWith("Z")) {
                const instruction = this.instructions[instructionIndex];
                node = node.step(instruction, this.network);
                instructionIndex = (instructionIndex + 1) % this.instructions.length;
                count++;
            }
            steps.push(count);
        }
        const count = leastCommonMultipleArray(steps);
        return [count.toString()];
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

    step(instruction: string, network: Record<string, Node>): Node {
        if (instruction == "L")
            return network[this.left];
        else if (instruction == "R")
            return network[this.right];
        else
            throw Error("wtf");
    }
}
