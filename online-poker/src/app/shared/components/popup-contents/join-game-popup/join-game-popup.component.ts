import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';
import {GameService} from '../../../services/game.service';
import {JoinGameData} from '../../../models/join-game-data';

@Component({
	selector: 'app-join-game-popup',
	templateUrl: './join-game-popup.component.html',
	styleUrls: ['./join-game-popup.component.scss']
})
export class JoinGamePopupComponent extends PopupContentCompDirective<string> {

	public gameLink: string;
	public error: string;

	constructor(private gameService: GameService) {
		super();
	}

	public async joinGameClick() {
		const gameData: JoinGameData = {
			id: this.gameLink,
			playerName: this.inputFromOpener
		}
		try {
			await this.gameService.joinGame(gameData)
			this.requestClose.emit();
		} catch (e) {
			this.error = e;
		}
	}

	public close() {
		this.requestClose.emit();
	}
}
