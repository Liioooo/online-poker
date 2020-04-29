import {Data, Server as WebSocketServer} from 'ws'
import * as WebSocket from 'ws';
import {IncomingMessage} from 'http';

export class WebsocketManager {

	constructor(private webSocket: WebSocketServer) {
		this.webSocket.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket: WebSocket, request: IncomingMessage) {
		// console.log(socket, request);
		console.log('connected');
		socket.on('message', msg => this.onMessage(socket, msg));
	}

	onMessage(socket: WebSocket, msg: Data) {
		console.log(msg);
		socket.send('{"yeeet": "boban"}');
	}
}
