import {Handler} from "../handler";
import {maxBy, minBy, sum} from "../util";

export class H9 extends Handler {
    private values: History[] = [];

    runA(input: string[]): string[] {
        for (const line of input) {
            const numbers = line.split(" ").map(s => +s);
            this.values.push(new History(numbers));
        }
        let total = 0;
        for (const value of this.values)
            total += value.predict();

        const derivativesMade = this.values.map(v => v.derivatives.length);
        const min = minBy(derivativesMade, d => d);
        const max = maxBy(derivativesMade, d => d);
        const mean = sum(derivativesMade) / derivativesMade.length;
        console.log(`Mean number of derivatives: ${mean} (range ${min} - ${max})`);

        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        let total = 0;
        for (const value of this.values)
            total += value.predictBack();

        return [total.toString()];
    }

}

interface PrevPred {
    previous: number[];
    prediction?: number;
    predictionBack?: number;
}

class History {
    history: PrevPred;
    derivatives: PrevPred[] = [];

    constructor(history: number[]) {
        this.history = { previous: history };
    }

    predict(): number {
        // Compute derivatives
        let numbers = this.history.previous;
        while (numbers.some(n => n != 0)) {
            const diffs = numbers.slice(1).map((n, i) => n - numbers[i]);
            this.derivatives.push({ previous: diffs });
            numbers = diffs;
        }
        // Compute predictions
        this.derivatives[this.derivatives.length - 1].prediction = 0;
        for (let i = this.derivatives.length - 2; i >= 0; i--) {
            const der = this.derivatives[i];
            der.prediction = der.previous[der.previous.length - 1] + (this.derivatives[i + 1].prediction as number);
        }
        this.history.prediction = this.history.previous[this.history.previous.length - 1] + (this.derivatives[0].prediction as number);
        return this.history.prediction;
    }

    predictBack(): number {
        this.derivatives[this.derivatives.length - 1].predictionBack = 0;
        for (let i = this.derivatives.length - 2; i >= 0; i--) {
            const der = this.derivatives[i];
            der.predictionBack = der.previous[0] - (this.derivatives[i + 1].predictionBack as number);
        }
        this.history.predictionBack = this.history.previous[0] - (this.derivatives[0].predictionBack as number);
        return this.history.predictionBack;
    }
}
