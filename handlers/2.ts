import {Handler} from "../handler";

interface RGB {
    red: number;
    green: number;
    blue: number;
}

export class H2 extends Handler {
    private minimums: RGB[] = [];
    private maximum: RGB = {
        red: 12,
        green: 13,
        blue: 14,
    };

    runA(input: string[]): string[] {
        for (const line of input) {
            const initialSplit = line.split(":");
            this.minimums.push(this.getMinimums(initialSplit[1]));
        }
        let sum = 0;
        for (let i = 0; i < this.minimums.length; i++) {
            const minimum = this.minimums[i];
            if (minimum.red <= this.maximum.red && minimum.green <= this.maximum.green && minimum.blue <= this.maximum.blue)
                sum += i + 1;
        }
        return [sum.toString()];
    }

    runB(input: string[]): string[] | undefined {
        let total = 0;
        for (const minimum of this.minimums) {
            total += minimum.red * minimum.green * minimum.blue;
        }
        return [total.toString()];
    }

    private getMinimums(pullsStr: string): RGB {
        const pulls = pullsStr.split(";");
        const minimum: RGB = { red: 0, green: 0, blue: 0 };
        for (const pull of pulls) {
            const rgb = this.parsePull(pull);
            if (rgb.red > minimum.red)
                minimum.red = rgb.red;
            if (rgb.green > minimum.green)
                minimum.green = rgb.green;
            if (rgb.blue > minimum.blue)
                minimum.blue = rgb.blue;
        }
        return minimum;
    }

    private parsePull(pull: string): RGB {
        const colors = pull.split(",");
        const rgb: RGB = { red: 0, green: 0, blue: 0 };
        for (let color of colors) {
            color = color.trim();
            const split = color.split(" ");
            rgb[split[1] as keyof RGB] = parseInt(split[0]);
            if (split[1] != "red" && split[1] != "green" && split[1] != "blue")
                throw Error("help");
        }
        return rgb;
    }
}