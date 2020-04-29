import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {CreateGameData} from '../models/create-game-data';
import {JoinGameData} from '../models/join-game-data';
import {Message, Event} from '../models/message';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private subject: WebSocketSubject<any>;

	constructor() {
		this.subject = webSocket({url: 'ws://localhost:8000/ws'});
	}

	private connect(data: JoinGameData | CreateGameData) {
		this.subject.subscribe(
			msg => this.receive(msg),
			err => console.log(err),
			() => console.log('complete') // Called when connection is closed (for whatever reason).
		);
		this.subject.next({
			event: (data as any).gameId ? Event.JOIN_GAME : Event.CREATE_GAME,
			game: data
		});
	}

	private receive(msg): void {
		if (msg.state) {

		}
	}

	public send(msg): void {
		this.subject.next(msg);
	}
}
