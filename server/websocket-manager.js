class WebsocketManager {

	constructor(webSocket) {
		this.websocket = webSocket;
		this.websocket.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket, request) {
		console.log(socket, request);
	}
}

module.exports = {WebsocketManager};
