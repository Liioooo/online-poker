import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Message} from '../models/message';
import {Event} from '../models/event';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private subject: WebSocketSubject<any>;
	private connected = false;

	constructor() {
		this.subject = webSocket({url: 'ws://localhost:8000/ws'});
	}

	public connect(data: JoinGameData | CreateGameData): Promise<number> {
		this.subject.subscribe(
			msg => this.receive(msg),
			err => console.log(err),
			() => console.log('connection closed') // Called when connection is closed (for whatever reason).
		);
		this.subject.next({
			event: (data as any).gameId ? Event.JOIN_GAME : Event.CREATE_GAME,
			game: data
		});
		return Promise.resolve(0);
	}

	private receive(msg): void {
		if (msg.error) {
			console.error(msg.error);
			return;
		}
		if (!this.connected) {
			if (msg.method === Event.CREATE_GAME || msg.method === Event.JOIN_GAME) {
				this.connected = true;
			}
		}
		if (msg.method === Event.UPDATE) {
			// TODO: Update state
		}
	}

	public send(msg): void {
		this.subject.next(msg);
	}
}
