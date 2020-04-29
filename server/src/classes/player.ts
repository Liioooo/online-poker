import * as WebSocket from 'ws';
import {Data} from 'ws';
import {Game} from './game';
import {parseMessage} from '../models/message';
import {Event} from '../models/event';
import {parseRaiseData} from '../models/message-data/raise-data';

export class Player {

	private _id: number;
	private _name: string;

	private _socket: WebSocket;
	private _game: Game;

	private _watchdog;
	private _isAlive = true;

	private _budget: number;

	constructor(socket: WebSocket, name: string) {
		this._socket = socket;
		this._name = name;

		this._socket.on('message', msg => {
			this.onMessage(msg);
		});

		this._watchdog = setInterval(() => {
			if (this._isAlive === false)
				return this._socket.terminate();

			this._isAlive = false;
			this._socket.ping();
		}, 5000);

		this._socket.on('pong', () => {
			this._isAlive = true;
		});

		socket.on('close', () => {
			this._disconnect();
		});
	}

	private onMessage(msg: Data) {
		console.log(`[${this._name}] ${msg}`);
		try {
			msg = JSON.parse(msg as string);
		} catch (e) {
			this._socket.send(JSON.stringify({error: 'Invalid request.'}));
			return;
		}
		const message = parseMessage(msg);
		if (!message) {
			this._socket.send(JSON.stringify({error: 'Invalid request format.'}));
			return;
		}

		switch (message.event) {
			case Event.RAISE:
				const data = parseRaiseData(message.data);
				if (!data) {
					this._socket.send(JSON.stringify({error: 'Invalid request format.'}));
					break;
				}
				if (this._game.currPlayer !== this) {
					this._socket.send(JSON.stringify({error: 'It is not your turn.'}));
					break;
				}
				this._game.raise(data.amount);
				break;
			case Event.CALL:
				if (this._game.currPlayer !== this) {
					this._socket.send(JSON.stringify({error: 'It is not your turn.'}));
					break;
				}
				this._game.call();
				break;
			case Event.CHECK:
				if (this._game.currPlayer !== this) {
					this._socket.send(JSON.stringify({error: 'It is not your turn.'}));
					break;
				}
				this._game.check();
				break;
			case Event.FOLD:
				if (this._game.currPlayer !== this) {
					this._socket.send(JSON.stringify({error: 'It is not your turn.'}));
					break;
				}
				this._game.fold();
				break;
			default:
				this._socket.send(JSON.stringify({error: 'It is not your turn.'}));
				break;
		}
	}

	private _disconnect() {
		clearInterval(this._watchdog);
		this._game.leave(this);
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

	public sendState(state) {
		this._socket.send(JSON.stringify({
			event: Event.UPDATE,
			data: state
		}));
	}
}
