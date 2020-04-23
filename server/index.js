const WebSocketServer = require('ws').Server;
const { createServer } = require("http");
const express = require("express");
const path = require('path');
const fs = require('fs');

const app = express();
const server = createServer(app);

const webSocketServer = new WebSocketServer({ server });
webSocketServer.on("connection", (webSocket) => {
	// ws connection
});

app.use(express.static(path.join(__dirname, '..', 'online-poker', 'dist')));
app.get('*', (req, res) => {
	const indexFile = path.join(__dirname, '..', 'online-poker', 'dist', 'index.html');
	if (fs.existsSync(indexFile)) {
		res.sendFile(indexFile);
	} else {
		res.status(400).send(req.path + ' not found');
	}
})

const portIndex = process.argv.findIndex(a => a === '--port');
const port = portIndex !== -1 ? process.argv[portIndex + 1] : 8000;
server.listen(port, () => console.log(`Server running on port: ${port}`))
