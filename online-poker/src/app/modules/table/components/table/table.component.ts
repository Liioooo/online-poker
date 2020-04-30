import {Component, OnInit} from '@angular/core';
import {GameService} from '../../../../shared/services/game.service';
import {Game} from '../../../../shared/classes/game';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupService} from '../../../../shared/services/popup.service';
import {AskForNameComponent} from '../../../../shared/components/popup-contents/ask-for-name/ask-for-name.component';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	public betAmount = 0;

	constructor(
		private gameService: GameService,
		private activatedRoute: ActivatedRoute,
		private popup: PopupService,
		private router: Router
	) {}

	async ngOnInit() {
		if (!!this.gameService.game) return;
		const gameId = this.activatedRoute.snapshot.paramMap.get('tableId');
		const playerName = await this.popup.showPopup(AskForNameComponent, 'Username', false);
		try {
			await this.gameService.joinGame({
				playerName,
				gameId
			});
		} catch (e) {
			this.router.navigate(['/']);
		}
	}

	public get canStart(): boolean {
		return !this.game.hasStarted && this.game.players.filter(p => !!p).length >= 2;
	}

	public get waitingForPlayers(): boolean {
		return this.game.players.filter(p => !!p).length < 2
	}

	public get game(): Game {
		return this.gameService.game;
	}

	public leave() {
		this.gameService.leaveGame();
	}

	public startGame() {
		this.gameService.startGame();
	}

	public fold() {
		this.gameService.fold();
	}

	public check() {
		this.gameService.check();
	}

	public call() {
		this.gameService.call();
	}

	public bet() {
		this.gameService.bet(this.betAmount);
	}

	public raise() {
		this.gameService.raise(this.betAmount);
	}

}
