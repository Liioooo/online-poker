import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {ErrorMessage, Message} from '../models/message';
import {Event} from '../models/event';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private subject: WebSocketSubject<any>;
	private subscription: Subscription;

	constructor() {
		this.subject = webSocket({url: 'ws://localhost:8000/ws'});
	}

	public connect(data: JoinGameData | CreateGameData): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.subscription = this.subject.subscribe(
				msg => this.receive(msg),
				err => console.log(err),
				() => console.log('connection closed') // Called when connection is closed (for whatever reason).
			);

			this.subject.pipe(
				take(1)
			).subscribe((msg) => {
				if (msg.error) {
					reject(msg.error);
					return;
				}
				if (msg.event === Event.CREATE_GAME || msg.event === Event.JOIN_GAME)
					resolve(msg.data.gameId);
			});
			this.subject.next({
				event: (data as any).gameId ? Event.JOIN_GAME : Event.CREATE_GAME,
				data
			});
		});
	}

	private receive(msg): void {
		if (msg.error) {
			console.error(msg.error);
			return;
		}
		if (msg.event === Event.UPDATE) {
			// TODO: Update state
		}
	}

	public send(msg): void {
		this.subject.next(msg);
	}
}
