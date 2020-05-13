import * as WebSocket from 'ws';
import {Data} from 'ws';
import {Game} from './game';
import {parseMessage} from '../models/message';
import {Event} from '../models/event';
import {parseRaiseData} from '../models/message-data/raise-data';
import {playingCard} from '../models/cards';
import {parseChatMessageData} from '../models/message-data/chat-message-data';

export class Player {
	private _id: number;
	private _name: string;

	private _socket: WebSocket;
	private _game: Game;

	private _watchdog;
	private _isAlive = true;

	private _budget: number;
	private _bet: number;
	private _inGame: boolean;
	private _hasRaised: boolean;
	private _hasCalled: boolean;

	private _hand: playingCard[];

	constructor(socket: WebSocket, name: string, game: Game) {
		this._socket = socket;
		this._name = name;
		this._game = game;

		this._bet = 0;
		this._inGame = false;
		this._hasRaised = false;
		this._hasCalled = false;
		this._hand = [];

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
			case Event.START_GAME:
				this.game.newGame();
				break;
			case Event.CHAT_MESSAGE:
				const msgData = parseChatMessageData(message.data);
				if (!msgData) {
					this._socket.send(JSON.stringify({error: 'Invalid request format.'}));
					break;
				}
				this._game.pushChatMessage(this._name, msgData.message);
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

	get game(): Game {
		return this._game;
	}

	set game(value: Game) {
		this._game = value;
	}

	get bet(): number {
		return this._bet;
	}

	set bet(value: number) {
		this._bet = value;
	}

	get hand(): playingCard[] {
		return this._hand;
	}

	set hand(value: playingCard[]) {
		this._hand = value;
	}

	get inGame(): boolean {
		return this._inGame;
	}

	set inGame(value: boolean) {
		this._inGame = value;
	}

	get hasRaised(): boolean {
		return this._hasRaised;
	}

	set hasRaised(value: boolean) {
		this._hasRaised = value;
	}

	get hasCalled(): boolean {
		return this._hasCalled;
	}

	set hasCalled(value: boolean) {
		this._hasCalled = value;
	}

	public sendState(state, event) {
		this._socket.send(JSON.stringify({
			event,
			data: state
		}));
	}
}
