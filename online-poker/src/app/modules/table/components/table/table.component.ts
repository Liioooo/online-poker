import {Component, OnInit} from '@angular/core';
import {GameService} from '../../../../shared/services/game.service';
import {Game} from '../../../../shared/classes/game';
import {ActivatedRoute} from '@angular/router';
import {PopupService} from '../../../../shared/services/popup.service';
import {AskForNameComponent} from '../../../../shared/components/popup-contents/ask-for-name/ask-for-name.component';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	constructor(
		private gameService: GameService,
		private activatedRoute: ActivatedRoute,
		private popup: PopupService
	) {}

	async ngOnInit() {
		if (!!this.gameService.game) return;
		const gameId = this.activatedRoute.snapshot.paramMap.get('tableId');
		const playerName = await this.popup.showPopup(AskForNameComponent, 'Username', false);
		this.gameService.joinGame({
			playerName,
			gameId
		})
	}

	public get game(): Game {
		return this.gameService.game;
	}

}
