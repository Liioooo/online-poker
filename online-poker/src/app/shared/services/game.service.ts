import {Injectable} from '@angular/core';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Router} from '@angular/router';
import {Game} from '../classes/game';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	private _currentGame: Game;

	constructor(private router: Router) {
	}

	// TODO: On success: router.navigate and resolve, on fail: reject with message and dont navigate

	public createGame(data: CreateGameData): Promise<void> {
		this.router.navigate(['table', 'tableId']);
		return Promise.resolve();
	}

	public joinGame(data: JoinGameData): Promise<void> {

		this.router.navigate(['table', 'tableId']);
		return Promise.resolve()
	}

	public get game(): Game {
		return this._currentGame;
	}
}
