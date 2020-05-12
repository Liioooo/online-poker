import {Injectable} from '@angular/core';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Router} from '@angular/router';
import {Game} from '../classes/game';
import {WebsocketService} from './websocket.service';
import {Event} from '../models/response/event';

@Injectable({
	providedIn: 'root'
})
export class GameService {

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

	public leaveGame() {
		this.webSocket.disconnect();
		this.router.navigate(['/']);
	}

	public startGame() {
		if (this.game.performedAction) return;
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.START_GAME,
			data: null
		});
	}

	public call() {
		if (this.game.performedAction || !this.game.canCall) return;
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.CALL,
			data: null
		});
	}

	public check() {
		if (this.game.performedAction || !this.game.canCheck) return;
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.CHECK,
			data: null
		});
	}

	public bet(amount: number) {
		if (this.game.performedAction ||
			!(this.game.canBet && amount <= this.game.playerBudget && amount >= Math.max(this.game.lastBet, this.game.bigBlind))){
			return;
		}
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.RAISE,
			data: {
				amount
			}
		});
	}

	public fold() {
		if (this.game.performedAction || !this.game.canFold) return;
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.FOLD,
			data: null
		});
	}

	public raise(amount: number) {
		if (this.game.performedAction ||
			!(this.game.canRaise && amount <= this.game.playerBudget && amount >= Math.max(this.game.lastBet, this.game.bigBlind))) {
			return;
		}
		this.game.performedAction = true;
		this.webSocket.send({
			event: Event.RAISE,
			data: {
				amount
			}
		});
	}

	public get game(): Game {
		return this.webSocket.game;
	}
}
