import {Handler} from "../handler";
import {stringToCharDict, sum} from "../util";

export class H7 extends Handler {
    private hands: Hand[] = [];

    runA(input: string[]): string[] {
        for (const line of input) {
            const split = line.split(" ");
            this.hands.push(new Hand(split[0], +split[1]));
        }
        this.hands.sort((a, b) => a.compareTo(b));

        for (let i = 0; i < this.hands.length; i++) {
            const hand = this.hands[i];
            hand.winnings = (i + 1) * hand.bid;
        }

        const total = sum(this.hands.map(h => h.winnings as number));
        return [total.toString()];
    }

    runB(input: string[]): string[] | undefined {
        for (const hand of this.hands) {
            hand.setPart2Type();
        }
        this.hands.sort((a, b) => a.compareTo2(b));

        for (let i = 0; i < this.hands.length; i++) {
            const hand = this.hands[i];
            hand.winnings = (i + 1) * hand.bid;
        }

        const total = sum(this.hands.map(h => h.winnings as number));
        return [total.toString()];
    }

}



class Hand {
    static cardOrder1: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    static cardOrder2: string[] = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];

    hand: string;
    bid: number;
    type: HandType;

    winnings?: number;

    constructor(hand: string, bid: number) {
        this.hand = hand;
        this.bid = bid;
        this.type = HandType.HighCard;
        const dict = stringToCharDict(hand);
        const values = Object.values(dict);
        if (values.some(c => c >= 2))
            this.type = HandType.Pair;
        if (values.filter(c => c >= 2).length >= 2)
            this.type = HandType.TwoPair;
        if (values.some(c => c >= 3))
            this.type = HandType.ThreeOAK;
        if (values.some(c => c == 3) && values.some(c => c == 2))
            this.type = HandType.FullHouse;
        if (values.some(c => c >= 4))
            this.type = HandType.FourOAK;
        if (values.some(c => c >= 5))
            this.type = HandType.FiveOAK;
    }

    setPart2Type() {
        this.type = HandType.HighCard;
        const dict = stringToCharDict(this.hand);
        const jokers = dict["J"] ?? 0;
        if (jokers == 5) {
            this.type = HandType.FiveOAK;
            return;
        }
        const nonJokerValues = Object.keys(dict).filter(c => c != "J").map(c => dict[c]);

        if (nonJokerValues.some(c => c + jokers >= 2))
            this.type = HandType.Pair;
        if (this.isTwoPair2(jokers, nonJokerValues))
            this.type = HandType.TwoPair;
        if (nonJokerValues.some(c => c + jokers >= 3))
            this.type = HandType.ThreeOAK;
        if (this.isFullHouse2(jokers, nonJokerValues))
            this.type = HandType.FullHouse;
        if (nonJokerValues.some(c => c + jokers >= 4))
            this.type = HandType.FourOAK;
        if (nonJokerValues.some(c => c + jokers >= 5))
            this.type = HandType.FiveOAK;
    }

    private isTwoPair2(jokers: number, nonJokerValues: number[]) {
        if (jokers >= 2)
            return true;
        if (jokers == 1)
            return nonJokerValues.some(c => c >= 2);
        return nonJokerValues.filter(c => c >= 2).length >= 2;
    }

    private isFullHouse2(jokers: number, nonJokerValues: number[]) {
        if (jokers >= 3)
            return true;
        if (jokers == 2)
            return nonJokerValues.some(c => c >= 2);
        if (jokers == 1)
            return nonJokerValues.filter(c => c >= 2).length >= 2 || nonJokerValues.some(c => c >= 3);
        return nonJokerValues.some(c => c == 3) && nonJokerValues.some(c => c == 2);
    }

    compareTo(b: Hand): number {
        if (this.type != b.type)
            return this.type - b.type;
        return this.compareIndividualCards(b, Hand.cardOrder1);
    }

    compareTo2(b: Hand): number {
        if (this.type != b.type)
            return this.type - b.type;
        return this.compareIndividualCards(b, Hand.cardOrder2);
    }

    private compareIndividualCards(b: Hand, cardOrder: string[]): number {
        for (let i = 0; i < this.hand.length; i++) {
            const cardA = this.hand[i];
            const cardB = b.hand[i];
            if (cardA != cardB) {
                const iA = cardOrder.indexOf(cardA);
                const iB = cardOrder.indexOf(cardB);
                if (iA < 0 || iB < 0)
                    throw Error("da's nie goe");
                return iA - iB;
            }
        }
        throw Error("no difference in hands");
    }
}

enum HandType {
    HighCard,
    Pair,
    TwoPair,
    ThreeOAK,
    FullHouse,
    FourOAK,
    FiveOAK,
}
