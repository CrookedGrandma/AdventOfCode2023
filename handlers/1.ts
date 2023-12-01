import {Handler} from "../handler";
import {sum} from "../util";

export class H1 extends Handler {
    map: Record<string, number> = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
    };

    runA(input: string[]): string[] {
        const values: number[] = [];
        for (const line of input) {
            if (!line)
                break;
            const numbers = Array.from(line.matchAll(/\d/g));
            const first = this.parse(numbers[0][0]);
            const last = this.parse(numbers[numbers.length - 1][0]);
            values.push(first * 10 + last);
        }
        const total = sum(values);
        return [ total.toString() ];
    }

    runB(input: string[]): string[] | undefined {
        const values: number[] = [];
        for (const line of input) {
            if (!line)
                break;
            const regex = /\d|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g;
            let match = line.match(regex);
            if (!match)
                throw Error("bruh");
            const first = this.parse(match[0]);

            let i = line.length;
            match = null;
            while (!match) {
                i -= 1;
                const remainder = line.substring(i);
                match = remainder.match(regex);
            }
            const last = this.parse(match[0]);
            values.push(first * 10 + last);
        }
        const total = sum(values);
        return [ total.toString() ];
    }

    parse(number: string) {
        const parsed = parseInt(number);
        if (!isNaN(parsed))
            return parsed;
        if (number in this.map)
            return this.map[number];
        throw Error("bro");
    }
}
