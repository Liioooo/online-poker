import {playingCard} from '../models/cards';

export class Player {

	private _id: number;
	private _name: string;

	private _hand: playingCard[];

	constructor() {
		this._hand = [];
	}


	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get hand(): playingCard[] {
		return this._hand;
	}

	set hand(value: playingCard[]) {
		this._hand = value;
	}
}
