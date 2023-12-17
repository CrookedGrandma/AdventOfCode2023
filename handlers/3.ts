import {Handler} from "../handler";
import {assertNotFalsy, eightAround, isInteger, sum} from "../util";

type ANumber = PartNumber | NotAPartNumber;

interface NumberBase /* do not use */ {
    number: number;
    startPos: Position;
    endPos: Position;
    isPartNumber: boolean;
    symbol?: Symbol;
}

interface PartNumber extends NumberBase {
    isPartNumber: true;
    symbol: Symbol;
}

interface NotAPartNumber extends NumberBase {
    isPartNumber: false;
}

interface Symbol {
    symbol: string;
    position: Position;
}

export class H3 extends Handler {
    private allNumbers: ANumber[] = [];
    private partNumbers: PartNumber[] = [];
    private notPartNumbers: NotAPartNumber[] = [];

    runA(input: string[]): string[] {
        for (let y = 0; y < input.length; y++) {
            const line = input[y];
            let track: string = "";
            let trackingStartPos: Position | undefined;
            // let trackingEndPos: Position | undefined;
            let trackingPartNumber: boolean = false;
            let trackingSymbol: Symbol | undefined;

            function stopTracking(xEndPos: number, yEndPos: number, handler: H3) {
                const integer = isInteger(track);
                if (integer !== false) {
                    switch (trackingPartNumber) {
                        case true:
                            const partNumber: PartNumber = {
                                number: integer,
                                startPos: assertNotFalsy(trackingStartPos),
                                endPos: { x: xEndPos, y: yEndPos },
                                isPartNumber: true,
                                symbol: assertNotFalsy(trackingSymbol),
                            };
                            handler.allNumbers.push(partNumber);
                            handler.partNumbers.push(partNumber);
                            break;
                        case false:
                            const notAPartNumber: NotAPartNumber = {
                                number: integer,
                                startPos: assertNotFalsy(trackingStartPos),
                                endPos: { x: xEndPos, y: yEndPos },
                                isPartNumber: false,
                            };
                            handler.allNumbers.push(notAPartNumber);
                            handler.notPartNumbers.push(notAPartNumber);
                            break;
                    }
                }
                track = "";
                trackingStartPos = undefined;
                // trackingEndPos = undefined;
                trackingPartNumber = false;
                trackingSymbol = undefined;
            }

            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (!isNaN(parseInt(char))) {
                    // add to track and check for symbols
                    track += char;
                    if (!trackingStartPos)
                        trackingStartPos = { x, y };
                    const symbol = this.anySymbolsAround(x, y, input);
                    if (symbol !== false) {
                        trackingPartNumber = true;
                        trackingSymbol = symbol;
                    }
                }
                else if (char == ".") {
                    // end tracking if necessary
                    stopTracking(x - 1, y, this);
                }
                else {
                    // char is a symbol
                    trackingPartNumber = true;
                    if (!trackingSymbol || trackingSymbol.symbol != "*")
                        trackingSymbol = { symbol: char, position: { x, y } };
                    stopTracking(x - 1, y, this);
                }
            }
            // if the last character was a number, we need to do something here
            stopTracking(line.length - 1, y, this);
        }

        const total = sum(this.partNumbers.map(p => p.number));
        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        const potentialGearAdjacent = this.partNumbers.filter(p => p.symbol.symbol == "*");
        const gearPositions: { position: Position, numbers: PartNumber[] }[] = [];
        for (const number of potentialGearAdjacent) {
            const gearPos = number.symbol.position;
            const neighbours = potentialGearAdjacent.filter(p => p.symbol.position.x == gearPos.x && p.symbol.position.y == gearPos.y);
            if (neighbours.length != 2)
                continue;
            if (gearPositions.some(gear => gear.position.x == gearPos.x && gear.position.y == gearPos.y))
                continue;
            gearPositions.push({ position: gearPos, numbers: neighbours });
        }
        const ratios = gearPositions.map(gear => gear.numbers[0].number * gear.numbers[1].number);
        const total = sum(ratios);
        return [total.toString()];
    }

    private anySymbolsAround(x: number, y: number, input: string[]): Symbol | false {
        const around = eightAround(x, y);
        for (const [testX, testY] of around) {
            const symbol = this.symbolAt(testX, testY, input);
            if (symbol !== false)
                return { symbol, position: { x: testX, y: testY } };
        }
        return false;
    }

    private symbolAt(x: number, y: number, input: string[]): string | false {
        if (x < 0 || x >= input[0].length)
            return false;
        if (y < 0 || y >= input.length)
            return false;
        const char = input[y][x];
        if (char == ".")
            return false;
        if (!isNaN(parseInt(char)))
            return false;
        return char;
    }
}
