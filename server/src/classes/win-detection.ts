import {Cards, playingCard} from '../models/cards';

export class WinDetection {
	public static getWinner(tableCards: playingCard[], hands: playingCard[][]): number {


		return 0;
	}

	private static getRanking(cards: playingCard[]): number[] {
		if (WinDetection.isRoyalFlush(cards))
			return [9];
		if (WinDetection.isStraightFlush(cards))


		return [];
	}



	private static royalFlush(cards: playingCard[]): number[] {
		const numbers = ['0', 'J', 'Q', 'K', 'A'];
		const suit = WinDetection.flushSuit(cards);
		if (!suit)
			return [];
		for (const num of numbers) {
			if (!cards.find(c => c === suit + num))
				return [];
		}
		return [9];
	}

	private static straightFlush(cards: playingCard[]): number[] {
		const suit = WinDetection.flushSuit(cards);
		if (!suit)
			return [];
		cards = cards.filter(c => c[0] !== suit);
		const straight = WinDetection.straight(cards);
		if (straight) {
			straight[0] = 8;
			return straight;
		}
		return [];
	}

	private static isFourOfAKind(cards: playingCard[]): number[] {
		const numberCounts = WinDetection.numberCounts(cards);
		for (const [num, count] of numberCounts) {
			if (count === 4)
				return [7, Cards.numbersIndex.get(num),
					Cards.numbersIndex.get(WinDetection.highestCard(cards.filter(c => c[1] !== num))[1])];
		}
		return [];
	}

	private static isFullHouse(cards: playingCard[]): boolean {
		let pairs = 0;
		let three = 0;
		const numberCounts = WinDetection.numberCounts(cards);
		for (const count of numberCounts.values()) {
			if (count === 2)
				pairs++;
			else if (count === 3)
				three++;
		}
		return pairs > 0 && three > 0;
	}

	private static isFlush(cards: playingCard[]): boolean {
		return !!WinDetection.flushSuit(cards);
	}

	private static straight(cards: playingCard[]): number[] {
		cards = WinDetection.sortByNumber(cards);
		if (Cards.isAce(cards[cards.length - 1])) {
			cards.unshift(cards[cards.length - 1]);
		}
		outer:
			for (let left = cards.length - 5; left >= 0; left--) {
				const index = Cards.numbersIndex.get(cards[left][1]);
				for (let i = 1; i < 5; i++) {
					if (Cards.numbersIndex.get(cards[left + i][1]) !== index + i) {
						continue outer;
					}
				}
				return [4, Cards.numbersIndex.get(WinDetection.highestCard(cards.slice(index, index + 5))[1])];
			}
		return [];
	}

	private static isThreeOfAKind(cards: playingCard[]): boolean {
		const numberCounts = WinDetection.numberCounts(cards);
		for (const count of numberCounts.values()) {
			if (count === 3)
				return true;
		}
		return false;
	}

	private static isTwoPair(cards: playingCard[]): boolean {
		let pairs = 0;
		const numberCounts = WinDetection.numberCounts(cards);
		for (const count of numberCounts.values()) {
			if (count === 2)
				pairs++;
		}
		return pairs >= 2;
	}

	private static isPair(cards: playingCard[]): boolean {
		const numberCounts = WinDetection.numberCounts(cards);
		for (const count of numberCounts.values()) {
			if (count === 2)
				return true;
		}
		return false;
	}



	private static highestCard(cards: playingCard[]): playingCard {
		cards = WinDetection.sortByNumber(cards);
		return cards[cards.length - 1];
	}

	private static sortByNumber(cards: playingCard[]): playingCard[] {
		return cards.sort((a, b) =>
			Cards.numbersIndex.get(a[1]) - Cards.numbersIndex.get(b[1]));
	}

	private static flushSuit(cards: playingCard[]): string {
		const colors = new Map<string, number>([['H', 0], ['T', 0], ['C', 0], ['S', 0]]);
		for (const card of cards)
			colors.set(card[0], colors.get(card[0]) + 1);
		for (const [suit, count] of colors)
			if (count >= 5)
				return suit;
		return '';
	}

	private static numberCounts(cards: playingCard[]): Map<string, number> {
		const out = new Map<string, number>();
		for (const card of cards) {
			const num = card[1];
			out.set(num, (out.get(num) || 0) + 1)
		}
		return out;
	}
}
