import {Component} from '@angular/core';
import {GameService} from '../../../../shared/services/game.service';
import {Game} from '../../../../shared/classes/game';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent {

	constructor(private gameService: GameService) {
	}

	public get game(): Game {
		return this.gameService.game;
	}

}
