import {Injectable} from '@angular/core';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Router} from '@angular/router';
import {Game} from '../classes/game';
import {WebsocketService} from './websocket.service';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	private _currentGame: Game;

	constructor(private router: Router, private webSocket: WebsocketService) {
	}

	// TODO: On success: router.navigate and resolve, on fail: reject with message and dont navigate

	public async createGame(data: CreateGameData): Promise<void> {
		const gameId = await this.webSocket.connect(data);
		this.router.navigate(['table', gameId]);
	}

	public async joinGame(data: JoinGameData): Promise<void> {
		const gameId = await this.webSocket.connect(data);
		this.router.navigate(['table', gameId]);
	}

	public get game(): Game {
		return this._currentGame;
	}
}
