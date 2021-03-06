import {shuffleArray} from './helpers';

export type playingCard = string; // length of 2: first is suit, second is type number

export class Cards {

	public static suits = ['H', 'D', 'C', 'S']; // heart, diamond, club, spade
	public static numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A'];

	public static numbersIndex = new Map<string, number>([
		['2', 0],
		['3', 1],
		['4', 2],
		['5', 3],
		['6', 4],
		['7', 5],
		['8', 6],
		['9', 7],
		['0', 8],
		['J', 9],
		['Q', 10],
		['K', 11],
		['A', 12]
	]);

	public static isAce(card: playingCard): boolean {
		return card[1] === 'A';
	}

	public static sortedDeck(): playingCard[] {
		const out = new Array(52);
		let i = 0;
		for (const suit of Cards.suits) {
			for (const num of Cards.numbers) {
				out[i++] = suit + num;
			}
		}
		return out;
	}

	public static shuffle(deck: playingCard[]): playingCard[] {
		return shuffleArray([...deck]);
	}

	public static newDeck(): playingCard[] {
		return Cards.shuffle(Cards.sortedDeck());
	}

	public static hasSameSuit(cardA: playingCard, cardB: playingCard): boolean {
		return cardA[0] === cardB[0];
	}

	public static hasSameNumber(cardA: playingCard, cardB: playingCard): boolean {
		return cardA[1] === cardB[1];
	}
}
