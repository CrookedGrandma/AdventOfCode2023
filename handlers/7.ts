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
        return undefined;
    }

}



class Hand {
    static cardOrder: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

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

    compareTo(b: Hand): number {
        if (this.type != b.type)
            return this.type - b.type;
        return this.compareIndividualCards(b);
    }

    private compareIndividualCards(b: Hand): number {
        for (let i = 0; i < this.hand.length; i++) {
            const cardA = this.hand[i];
            const cardB = b.hand[i];
            if (cardA != cardB) {
                const iA = Hand.cardOrder.indexOf(cardA);
                const iB = Hand.cardOrder.indexOf(cardB);
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
