import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Event} from '../models/response/event';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {ErrorMessage, Message} from '../models/response/message';
import {JoinGameResponseData} from '../models/response/join-game-response-data';
import {Game} from '../classes/game';
import {UpdateEventData} from '../models/response/update-event-data';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private _currentGame: Game;

	private _subject: WebSocketSubject<any>;
	private _subscription: Subscription;

	constructor() {
		this._subject = webSocket({url: 'ws://localhost:8000/ws'});
	}

	public connect(data: JoinGameData | CreateGameData): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this._subscription = this._subject.subscribe(
				msg => this.receive(msg),
				err => console.log(err),
				() => console.log('connection closed') // Called when connection is closed (for whatever reason).
			);

			this._subject.pipe(
				take(1)
			).subscribe((msg: Message & ErrorMessage) => {
				if (msg.error) {
					reject(msg.error);
					return;
				}
				if (msg.event === Event.CREATE_GAME || msg.event === Event.JOIN_GAME) {
					const gameId = (msg.data as JoinGameResponseData).gameId;
					this._currentGame = new Game(gameId);
					resolve(gameId);
				}
			});
			this._subject.next({
				event: (data as any).gameId ? Event.JOIN_GAME : Event.CREATE_GAME,
				data
			});
		});
	}

	public disconnect() {
		this._subscription.unsubscribe();
		delete this._currentGame;
	}

	private receive(msg: Message & ErrorMessage): void {
		if (msg.error) {
			console.error(msg.error);
			return;
		}
		if (msg.event === Event.UPDATE && this._currentGame) {
			this._currentGame.updateState(msg.data as UpdateEventData);
		}
	}

	public send(msg: Message): void {
		this._subject.next(msg);
	}

	public get game(): Game {
		return this._currentGame;
	}
}
