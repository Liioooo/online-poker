import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../../../shared/services/popup.service';
import {CreateGamePopupComponent} from '../../../../shared/components/popup-contents/create-game-popup/create-game-popup.component';
import {JoinGamePopupComponent} from '../../../../shared/components/popup-contents/join-game-popup/join-game-popup.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public playerName: string;

	constructor(private popupService: PopupService) {
	}

	ngOnInit(): void {
	}

	public createGameClick() {
		this.popupService.showPopup(CreateGamePopupComponent, 'Create Game', true, this.playerName);
	}

	public joinGameClick() {
		this.popupService.showPopup(JoinGamePopupComponent, 'Join Game', true, this.playerName);

	}

}
