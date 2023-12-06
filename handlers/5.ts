import {Handler} from "../handler";
import {isInteger, minBy} from "../util";

interface Map {
    sourceStart: number;
    destinationStart: number;
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
        return undefined;
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

    private getLocation(seed: number): number {
        const soil = this.getDestination(seed, this.seedToSoil);
        const fertilizer = this.getDestination(soil, this.soilToFertilizer);
        const water = this.getDestination(fertilizer, this.fertilizerToWater);
        const light = this.getDestination(water, this.waterToLight);
        const temperature = this.getDestination(light, this.lightToTemperature);
        const humidity = this.getDestination(temperature, this.temperatureToHumidity);
        return this.getDestination(humidity, this.humidityToLocation);
    }
}
