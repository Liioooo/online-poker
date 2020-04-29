import {Server as WebSocketServer} from 'ws'
import { createServer } from 'http';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {WebsocketManager} from './websocket-manager';

const app = express();
const server = createServer(app);

const webSocketServer = new WebSocketServer({ server, path: '/ws'});
const websocketManager = new WebsocketManager(webSocketServer);

app.use(express.static(path.join(__dirname, '..', '..', 'online-poker', 'dist')));
app.get('*', (req, res) => {
	const indexFile = path.join(__dirname, '..', '..', 'online-poker', 'dist', 'index.html');
	if (fs.existsSync(indexFile)) {
		res.sendFile(indexFile);
	} else {
		res.status(400).send(req.path + ' not found');
	}
});

const portIndex = process.argv.findIndex(a => a === '--port');
const port = portIndex !== -1 ? process.argv[portIndex + 1] : 8000;
server.listen(port, () => console.log(`Server running on port: ${port}`));
