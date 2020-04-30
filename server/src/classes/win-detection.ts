import {Cards, playingCard} from '../models/cards';

export class WinDetection {

	public static getWinners(tableCards: playingCard[], hands: playingCard[][]): number[] {
		let rankings: number[][] = [];
		for (let hand of hands)
			rankings.push(WinDetection.getRanking(tableCards.concat(hand)));
		rankings = rankings.sort((b, a) => {
			return WinDetection.rankingDiff(b, a);
		});

		const winners = [rankings.pop()];
		let other;
		while (rankings.length > 0 && WinDetection.rankingDiff(winners[0], other = rankings.pop()) === 0) {
			winners.push(other);
		}
		console.log(winners);
		return [0];
	}

	private static rankingDiff(a: number[], b: number[]): number {
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i])
				return a[i] - b[i];
		}
		return 0;
	}

	public static randomCheck(count: number) {
		const map = new Map<number, number>([
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]
		]);
		for (let i = 0; i < count; i++) {
			const cards = Cards.newDeck().slice(0, 7);
			const val = WinDetection.getRanking(cards)[0];
			map.set(val, map.get(val) + 1);
		}
		console.log(map);
		for (const val of map.values()) {
			console.log(val / count * 100 + '%');
		}
	}

	public static randomWinCheck(count: number) {
		for (let i = 0; i < count; i++) {
			const cardsTable = Cards.newDeck().slice(0, 5);
			const cards0 = Cards.newDeck().slice(0, 2);
			const cards1 = Cards.newDeck().slice(0, 2);
			const cards2 = Cards.newDeck().slice(0, 2);
			console.log(cardsTable, cards0, cards1, cards2);
			WinDetection.getWinners(cardsTable, [cards0, cards1, cards2]);
		}
	}

	public static getRanking(cards: playingCard[]): number[] {
		const handRankings = [
			'royalFlush',
			'straightFlush',
			'fourOfAKind',
			'fullHouse',
			'flush',
			'straight',
			'threeOfAKind',
			'twoPair',
			'onePair',
			'highCard',
		];
		let rankValues = [];
		let counter = 0;
		while (rankValues.length === 0) {
			rankValues = WinDetection[handRankings[counter++]]([...cards]);
		}
		return rankValues;
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
		cards = cards.filter(c => c[0] === suit);
		const straight = WinDetection.straight(cards);
		if (straight.length > 0) {
			straight[0] = 8;
			return straight;
		}
		return [];
	}

	private static fourOfAKind(cards: playingCard[]): number[] {
		const numberCounts = WinDetection.numberCounts(cards);
		for (const [num, count] of numberCounts) {
			if (count === 4)
				return [7, Cards.numbersIndex.get(num),
					Cards.numbersIndex.get(WinDetection.highestCard(cards.filter(c => c[1] !== num))[1])];
		}
		return [];
	}

	private static fullHouse(cards: playingCard[]): number[] {
		let pairVal = -1;
		let threeVal = -1;
		const numberCounts = WinDetection.numberCounts(cards);
		for (const [num, count] of numberCounts) {
			if (count === 2 && Cards.numbersIndex.get(num) > pairVal)
				pairVal = Cards.numbersIndex.get(num);
			else if (count === 3) {
				if (pairVal < 0) {
					if (Cards.numbersIndex.get(num) > threeVal) {
						pairVal = threeVal;
						threeVal = Cards.numbersIndex.get(num);
					}
					if (Cards.numbersIndex.get(num) < threeVal) {
						pairVal = Cards.numbersIndex.get(num);
					}
				}
				if (Cards.numbersIndex.get(num) > threeVal) {
					threeVal = Cards.numbersIndex.get(num);
				}
			}
		}
		if (pairVal > -1 && threeVal > -1) {
			return [6, threeVal, pairVal];
		}
		return [];
	}

	private static flush(cards: playingCard[]): number[] {
		const suit = WinDetection.flushSuit(cards);
		if (!suit)
			return [];
		cards = WinDetection.sortByNumber(cards.filter(c => c[0] === suit));
		while (cards.length > 5)
			cards.shift();
		const out = cards.map(c => Cards.numbersIndex.get(c[1])).reverse();
		return [5, ...out];
	}

	private static straight(cards: playingCard[]): number[] {
		if (cards.length < 5)
			return [];
		cards = WinDetection.sortByNumber(cards);
		if (Cards.isAce(cards[cards.length - 1])) {
			cards.unshift(cards[cards.length - 1]);
		}
		outer:
			for (let left = cards.length - 5; left >= 0; left = Math.min(cards.length - 5, left - 1)) {
				const value = Cards.numbersIndex.get(cards[left][1]);
				for (let i = 1; i < 5; i++) {
					while (left > 0 && cards[left + i][1] === cards[left + i - 1][1]) {
						cards.splice(left + i, 1);
						left++;
						if (cards.length < 5)
							return [];
						continue outer;
					}
					if (Cards.numbersIndex.get(cards[left + i][1]) !== value + i) {
						if (Cards.numbersIndex.get(cards[left + i][1]) === value - 13 + i) {
							continue;
						}
						continue outer;
					}
				}
				return [4, value % 12];
			}
		return [];
	}

	private static threeOfAKind(cards: playingCard[]): number[] {
		const numberCounts = WinDetection.numberCounts(cards);
		let threeVal = -1;
		for (const [num, count] of numberCounts) {
			if (count === 3) {
				if (Cards.numbersIndex.get(num) > threeVal)
					threeVal = Cards.numbersIndex.get(num);
			}
		}
		if (threeVal < 0)
			return [];
		const out = WinDetection.highestCards(cards.filter(c => Cards.numbersIndex.get(c[1]) !== threeVal), 2)
			.map(c => Cards.numbersIndex.get(c[1]));
		return [3, threeVal, ...out];
	}

	private static twoPair(cards: playingCard[]): number[] {
		let pair0Val = -1;
		let pair1Val = -1;
		const numberCounts = WinDetection.numberCounts(cards);
		for (const [num, count] of numberCounts) {
			if (count === 2) {
				const lower = pair0Val < pair1Val ? pair0Val : pair1Val;
				if (Cards.numbersIndex.get(num) > lower) {
					if (lower === pair0Val)
						pair0Val = Cards.numbersIndex.get(num);
					else
						pair1Val = Cards.numbersIndex.get(num);
				}
			}
		}
		if (pair0Val < 0 || pair1Val < 0)
			return [];
		const highest = WinDetection.highestCard(cards.filter(c =>
				Cards.numbersIndex.get(c[1]) !== pair0Val && Cards.numbersIndex.get(c[1]) !== pair1Val
			));
		return [2, pair0Val > pair1Val ? pair0Val : pair1Val,
			pair0Val > pair1Val ? pair1Val : pair0Val, Cards.numbersIndex.get(highest[1])];
	}

	private static onePair(cards: playingCard[]): number[] {
		let pairVal = -1;
		const numberCounts = WinDetection.numberCounts(cards);
		for (const [num, count] of numberCounts) {
			if (count === 2 && Cards.numbersIndex.get(num) > pairVal)
				pairVal = Cards.numbersIndex.get(num);
		}
		if (pairVal < 0)
			return [];
		const out = WinDetection.highestCards(cards.filter(c => Cards.numbersIndex.get(c[1]) !== pairVal), 3)
			.map(c => Cards.numbersIndex.get(c[1]));
		return [1, pairVal, ...out];
	}

	private static highCard(cards: playingCard[]): number[] {
		const out = WinDetection.highestCards(cards, 5)
			.map(c => Cards.numbersIndex.get(c[1]));
		return [0, ...out];
	}



	private static highestCards(cards: playingCard[], amount: number): playingCard[] {
		cards = WinDetection.sortByNumber(cards);
		return cards.splice(cards.length - amount, amount).reverse();
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
		const colors = new Map<string, number>([['H', 0], ['D', 0], ['C', 0], ['S', 0]]);
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
