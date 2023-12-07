import {Handler} from "../handler";

interface Race {
    time: number;
    record: number;
}

export class H6 extends Handler {
    private races: Race[] = [];

    runA(input: string[]): string[] {
        const times = input[0].split(/\s+/).slice(1).map(n => parseInt(n));
        const distances = input[1].split(/\s+/).slice(1).map(n => parseInt(n));
        for (let i = 0; i < times.length; i++) {
            this.races.push({
                time: times[i],
                record: distances[i],
            });
        }

        const waysPerRace: number[] = [];
        for (const race of this.races) {
            const min = this.getMinTimeBeatingRecord(race);
            const max = this.getMaxTimeBeatingRecord(race);
            const ways = max - min + 1;
            waysPerRace.push(ways < 0 ? 0 : ways);
        }
        const product = waysPerRace.reduce((a, b) => a * b, 1);
        return [product.toString()];
    }

    runB(input: string[]): string[] | undefined {
        const times = parseInt(input[0].split(/Time:\s+/)[1].replace(/\s+/g, ""));
        const distances = parseInt(input[1].split(/Distance:\s+/)[1].replace(/\s+/g, ""));
        this.races = [];
        this.races.push({
            time: times,
            record: distances,
        });

        const waysPerRace: number[] = [];
        for (const race of this.races) {
            const min = this.getMinTimeBeatingRecord(race);
            const max = this.getMaxTimeBeatingRecord(race);
            const ways = max - min + 1;
            waysPerRace.push(ways < 0 ? 0 : ways);
        }
        const product = waysPerRace.reduce((a, b) => a * b, 1);
        return [product.toString()];
    }

    private getMinTimeBeatingRecord(race: Race): number {
        for (let i = 1; i < race.time - 1; i++) {
            if (this.distance(race, i) > race.record)
                return i;
        }
        return race.time;
    }

    private getMaxTimeBeatingRecord(race: Race): number {
        for (let i = race.time - 1; i > 0; i--) {
            if (this.distance(race, i) > race.record)
                return i;
        }
        return 0;
    }

    private distance(race: Race, msButtonHeld: number): number {
        return (race.time - msButtonHeld) * msButtonHeld;
    }

}
