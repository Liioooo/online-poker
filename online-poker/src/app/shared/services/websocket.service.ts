import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private subject: WebSocketSubject<any>;

	constructor() {
		this.subject = webSocket({url: 'ws://localhost:8000/ws'});

		this.subject.subscribe(
			msg => this.receive(msg),
			err => console.log(err),
			() => console.log('complete') // Called when connection is closed (for whatever reason).
		);
	}

	private receive(msg): void {
		console.log(msg);
	}

	public send(msg): void {
		this.subject.next(msg);
	}
}
