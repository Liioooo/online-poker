class WebsocketManager {

	constructor(webSocket) {
		this.websocket = webSocket;
		this.websocket.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket, request) {
		// console.log(socket, request);
		console.log('connected');
		socket.on('message', msg => this.onMessage(socket, msg));
	}

	onMessage(socket, msg) {
		console.log(msg);
		socket.send('{"yeeet": "boban"}');
	}
}

module.exports = {WebsocketManager};
