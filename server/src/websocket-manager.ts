import * as WebSocket from 'ws'
import {Server as WebSocketServer} from 'ws'
import {IncomingMessage} from 'http';
import {Player} from './classes/player';
import {Game} from './classes/game';
import {Message} from './models/message';
import {Event} from '../../online-poker/src/app/shared/models/message';
import {parseCreateGameData} from './models/message-data/create-game-data';
import {parseJoinGameData} from './models/message-data/join-game-data';
import {Socket} from './models/socket';

export class WebsocketManager {
	private games = new Map<string, Game>();

	constructor(private webSocket: WebSocketServer) {
		this.webSocket.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket: WebSocket, request: IncomingMessage) {
		console.log(socket, request);
		const timeout = setTimeout(() => {
			socket.send({
				error: 'No player data received.'
			});
			socket.close();
		}, 3000);

		socket.on('message', (msg: string) => {
			const message: Message = JSON.parse(msg);
			if (message.event === Event.CREATE_GAME) {
				const data = parseCreateGameData(message.data);
				if (!data) {
					socket.send({
						error: 'Invalid request'
					});
				}
				const player = new Player(socket, data.playerName);
				const game = new Game();
				game.join(player);
				this.games.set(game.id, game);
				socket.send({
					gameId: game.id
				});
				clearTimeout(timeout);
			} else if (message.event == Event.JOIN_GAME) {
				const data = parseJoinGameData(message.data);
				if (!data) {
					socket.send({
						error: 'Invalid request'
					});
				}
				if (!this.games.has(data.gameId)) {
					socket.send({
						error: 'Game does not exist.'
					});
				}
				const player = new Player(socket, data.playerName);
				this.games.get(data.gameId).join(player);
				clearTimeout(timeout);
			}
		});
	}
}
