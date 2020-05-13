import {Component, OnInit} from '@angular/core';
import {GameService} from '../../../../shared/services/game.service';
import {Game} from '../../../../shared/classes/game';
import {ActivatedRoute} from '@angular/router';
import {PopupService} from '../../../../shared/services/popup.service';
import {AskForNameComponent} from '../../../../shared/components/popup-contents/ask-for-name/ask-for-name.component';
import {ErrorComponent} from '../../../../shared/components/popup-contents/error/error.component';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	public betAmount: number;

	constructor(
		private gameService: GameService,
		private activatedRoute: ActivatedRoute,
		private popup: PopupService
	) {}

	async ngOnInit() {
		if (!!this.gameService.game) {
			this.betAmount = this.game.bigBlind;
			return;
		}
		const gameId = this.activatedRoute.snapshot.paramMap.get('tableId');
		const playerName = await this.popup.showPopup(AskForNameComponent, 'Username', false);
		try {
			await this.gameService.joinGame({
				playerName,
				gameId
			});
			this.betAmount = this.game.bigBlind;
		} catch (e) {
			this.gameService.leaveGame();
			this.popup.showPopup(ErrorComponent, 'Error joining game', true, e);
		}
	}

	public get canStart(): boolean {
		return !this.game.hasStarted && this.game.players.filter(p => !!p).length >= 2 && !this.waitingForGame;
	}

	public get waitingForPlayers(): boolean {
		if (!this.game.hasStarted && this.game.players.filter(p => !!p).length < 2) {
			return true;
		} else if (this.game.hasStarted && !this.game.isPlayerTurn) {
			return true;
		} else if (this.game.isWinState && this.game.players.filter(p => !!p).length < 2) {
			return true;
		}
		return false;
	}

	public get waitingForGame(): boolean {
		return this.game.isWinState && this.game.players.filter(p => !!p).length >= 2;
	}

	public get minBetAmount(): number {
		return Math.max(this.game.bigBlind, this.game.lastBet);
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
