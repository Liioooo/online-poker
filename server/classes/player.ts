import {playingCard} from '../models/cards';

export class Player {

	private _id: number;
	private _name: string;

	private _budget: number;

	constructor() {
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

	get budget(): number {
		return this._budget;
	}

	set budget(value: number) {
		this._budget = value;
	}
}
