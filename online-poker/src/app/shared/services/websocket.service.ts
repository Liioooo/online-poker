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
import {WinEventData} from '../models/response/win-event-data';
import {Router} from '@angular/router';
import {PopupService} from './popup.service';
import {ErrorComponent} from '../components/popup-contents/error/error.component';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private _currentGame: Game;

	private _subject: WebSocketSubject<any>;
	private _subscription: Subscription;

	constructor(private router: Router, private popup: PopupService) {
		this._subject = webSocket({url: 'ws://localhost:8000/ws'});
	}

	public connect(data: JoinGameData | CreateGameData): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this._subscription = this._subject.subscribe(
				msg => this.receive(msg),
				err => this.connectionLost(err),
				() => this.connectionLost()
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

	public connectionLost(err?: any) {
		console.log(err);
		this.disconnect();
		this.router.navigate(['/']);
		this.popup.closePopups();
		this.popup.showPopup(ErrorComponent, 'Connection lost', true, 'The connection to the Game server was lost.');
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
		if (msg.event === Event.WIN) {
			this._currentGame.win(msg.data as WinEventData);
		}
	}

	public send(msg: Message): void {
		this._subject.next(msg);
	}

	public get game(): Game {
		return this._currentGame;
	}
}
