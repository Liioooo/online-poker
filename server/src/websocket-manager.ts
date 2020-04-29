import * as WebSocket from 'ws'
import {Server as WebSocketServer} from 'ws'
import {IncomingMessage} from 'http';
import {Player} from './classes/player';
import {Game} from './classes/game';
import {Message, parseMessage} from './models/message';
import {Event} from './models/event';
import {parseCreateGameData} from './models/message-data/create-game-data';
import {parseJoinGameData} from './models/message-data/join-game-data';

export class WebsocketManager {
	private games = new Map<string, Game>();

	constructor(private webSocket: WebSocketServer) {
		this.webSocket.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket: WebSocket, request: IncomingMessage) {
		const timeout = setTimeout(() => {
			socket.send(JSON.stringify({
				error: 'No player data received.'
			}));
			socket.close();
		}, 1000000);

		socket.on('message', (msg: string) => {
			let message: Message;
			try {
				message = JSON.parse(msg);
				if (!parseMessage(message)) throw new Error();
			} catch (e) {
				socket.send(JSON.stringify({
					error: 'Invalid request'
				}));
				return;
			}
			if (message.event === Event.CREATE_GAME) {
				const data = parseCreateGameData(message.data);
				if (!data) {
					socket.send(JSON.stringify({
						error: 'Invalid request'
					}));
					return;
				}
				const game = new Game();
				const player = new Player(socket, data.playerName, game);
				this.games.set(game.id, game);
				socket.send(JSON.stringify({
					event: Event.JOIN_GAME,
					data: {
						gameId: game.id
					}
				}));
				game.join(player);
				clearTimeout(timeout);
			} else if (message.event == Event.JOIN_GAME) {
				const data = parseJoinGameData(message.data);
				if (!data) {
					socket.send(JSON.stringify({
						error: 'Invalid request'
					}));
					return;
				}
				if (!this.games.has(data.gameId)) {
					socket.send(JSON.stringify({
						error: 'Game does not exist.'
					}));
					return;
				}
				const player = new Player(socket, data.playerName, this.games.get(data.gameId));
				socket.send(JSON.stringify({
					event: Event.CREATE_GAME,
					data: {
						gameId: data.gameId
					}
				}));
				this.games.get(data.gameId).join(player);
				clearTimeout(timeout);
			} else {
				socket.send(JSON.stringify({
					error: 'User is not initialized yet.'
				}));
			}
		});
	}
}
