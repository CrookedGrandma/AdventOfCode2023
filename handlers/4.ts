import {Handler} from "../handler";
import {sum} from "../util";

interface Card {
    id: number;
    winningNumbers: number[];
    presentNumbers: number[];
    copies: number;
}

export class H4 extends Handler {
    private cards: Card[] = [];
    private scores: Record<number, number> = {};

    runA(input: string[]): string[] {
        for (const line of input) {
            const cardNumberSplit = line.split(/:\s+/)
            const index = parseInt(cardNumberSplit[0].split(/Card\s+/)[1]);
            const numbers = cardNumberSplit[1].split(/\s+\|\s+/);
            const winning = numbers[0].split(/\s+/).map(n => parseInt(n));
            const present = numbers[1].split(/\s+/).map(n => parseInt(n));
            const card: Card = {
                id: index,
                winningNumbers: winning,
                presentNumbers: present,
                copies: 1,
            };
            this.cards.push(card);
        }

        for (const card of this.cards) {
            this.scores[card.id] = this.score(card);
        }

        const total = sum(Object.values(this.scores));

        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const presentWinning = this.presentWinning(card).length;
            for (let c = 0; c < card.copies; c++) {
                for (let w = 0; w < presentWinning; w++) {
                    const toCopy = this.cards[i + w + 1];
                    if (!toCopy)
                        break;
                    toCopy.copies++;
                }
            }
        }

        const total = sum(this.cards.map(c => c.copies));

        return [total.toString()];
    }

    private score(card: Card): number {
        const presentWinning = this.presentWinning(card);
        if (presentWinning.length == 0)
            return 0;
        return Math.pow(2, presentWinning.length - 1);
    }

    private presentWinning(card: Card): number[] {
        return card.presentNumbers.filter(n => card.winningNumbers.includes(n));
    }

    private winningPresent(card: Card): number[] {
        return card.winningNumbers.filter(n => card.presentNumbers.includes(n));
    }
}