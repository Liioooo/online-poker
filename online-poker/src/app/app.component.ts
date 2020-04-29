import {Component} from '@angular/core';
import {WebsocketService} from './shared/services/websocket.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor(private webSocket: WebsocketService) {
	}

}
