import {Handler} from "../handler";
import {isInteger, minBy, sum} from "../util";

interface Map {
    sourceStart: number;
    destinationStart: number;
    length: number;
}

interface Range {
    start: number;
    length: number;
}

export class H5 extends Handler {
    private seeds: number[] = [];

    private seedToSoil: Map[] = []
    private soilToFertilizer: Map[] = [];
    private fertilizerToWater: Map[] = [];
    private waterToLight: Map[] = [];
    private lightToTemperature: Map[] = [];
    private temperatureToHumidity: Map[] = [];
    private humidityToLocation: Map[] = [];

    runA(input: string[]): string[] {
        // noinspection JSMismatchedCollectionQueryUpdate
        let currentMap: Map[] = [];
        for (const line of input) {
            if (line.startsWith("seeds:")) {
                // seeds specification
                const seedsStr = line.split("seeds: ")[1];
                this.seeds = seedsStr.split(" ").map(s => parseInt(s));
            }
            else if (isInteger(line[0]) !== false) {
                // map definition
                const [destinationStart, sourceStart, length] = line.split(" ").map(s => parseInt(s));
                currentMap.push({ sourceStart, destinationStart, length });
            }
            else {
                // new map type
                const source = line.split("-", 1)[0];
                currentMap = this.getMap(source);
            }
        }

        const locations = this.seeds.map(s => this.getLocation(s));
        const lowest = minBy(locations, l => l);
        return [lowest.toString()];
    }

    runB(input: string[]): string[] | undefined {
        const seedRanges: Range[] = [];
        for (let i = 0; i < this.seeds.length; i += 2)
            seedRanges.push({ start: this.seeds[i], length: this.seeds[i + 1] });

        const total = sum(seedRanges.map(r => r.length));
        let done = 0;

        let lowest = Number.MAX_VALUE;
        for (const range of seedRanges) {
            for (let i = 0; i < range.length; i++) {
                if (done % 1000000 == 0)
                    console.log(`Done ${done}/${total}`);
                const loc = this.getLocation(range.start + i);
                if (loc < lowest)
                    lowest = loc;
                done++;
            }
        }

        return [lowest.toString()];
    }

    private getMap(source: string): Map[] {
        switch (source) {
            case "seed":
                return this.seedToSoil;
            case "soil":
                return this.soilToFertilizer;
            case "fertilizer":
                return this.fertilizerToWater;
            case "water":
                return this.waterToLight;
            case "light":
                return this.lightToTemperature;
            case "temperature":
                return this.temperatureToHumidity;
            case "humidity":
                return this.humidityToLocation;
            default:
                throw Error(`y u mapping from ${source} (zoals de toekomstige premier ooit zei: 'doe normaal')`);
        }
    }

    private getDestination(source: number, maps: Map[]): number {
        for (const map of maps) {
            if (source >= map.sourceStart && source < map.sourceStart + map.length)
                return source + (map.destinationStart - map.sourceStart);
        }
        return source;
    }

    private getSource(destination: number, maps: Map[]): number {
        for (const map of maps) {
            if (destination >= map.destinationStart && destination < map.destinationStart + map.length)
                return destination - (map.destinationStart - map.sourceStart);
        }
        return destination;
    }

    private getLocation(seed: number): number {
        const soil = this.getDestination(seed, this.seedToSoil);
        const fertilizer = this.getDestination(soil, this.soilToFertilizer);
        const water = this.getDestination(fertilizer, this.fertilizerToWater);
        const light = this.getDestination(water, this.waterToLight);
        const temperature = this.getDestination(light, this.lightToTemperature);
        const humidity = this.getDestination(temperature, this.temperatureToHumidity);
        return this.getDestination(humidity, this.humidityToLocation);
    }

    private getSeed(location: number): number {
        const humidity = this.getSource(location, this.humidityToLocation);
        const temperature = this.getSource(humidity, this.temperatureToHumidity);
        const light = this.getSource(temperature, this.lightToTemperature);
        const water = this.getSource(light, this.waterToLight);
        const fertilizer = this.getSource(water, this.fertilizerToWater);
        const soil = this.getSource(fertilizer, this.soilToFertilizer);
        return this.getSource(soil, this.seedToSoil);
    }
}
