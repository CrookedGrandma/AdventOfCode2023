import fs from "fs";
import {Handler} from "./handler";

const USE_EXAMPLE = false;

const handlerNames = fs.readdirSync("handlers/").sort((a, b) => parseInt(a) - parseInt(b));
const latestHandlerName = handlerNames[handlerNames.length - 1];
const handlerNumber = latestHandlerName.split(".")[0] + (USE_EXAMPLE ? "E" : "");

console.log(`CHALLENGE NUMBER: ${handlerNumber}\n`);

const input = fs.readFileSync(`input/${handlerNumber}.txt`).toString().split("\n").map(l => l.trim()).filter(l => !!l);

const handler = new(Object.values(require(`./handlers/${latestHandlerName}`))[0] as new(input: string[]) => Handler)(input);


const outputA = handler.runA(input);
const printA = outputA.join("\n");

fs.writeFileSync(`output/${handlerNumber}.txt`, printA);
console.log(printA);

const outputB = handler.runB(input);
if (outputB) {
    const printB = "\n\n========== SECOND TASK ==========\n\n" + outputB.join("\n");
    fs.writeFileSync(`output/${handlerNumber}.txt`, printB, { flag: "a" });
    console.log(printB);
}
