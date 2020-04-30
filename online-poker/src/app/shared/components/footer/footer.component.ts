import {Component, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	constructor(private gameService: GameService) {
	}

	ngOnInit(): void {
	}

	public get hasGame(): boolean {
		return !!this.gameService.game;
	}

	public get inviteLink(): string {
		return location.origin + '/table/' + this.gameService.game.gameId;
	}

	public copyClick() {
		const el = document.createElement('textarea');
		el.value = this.inviteLink;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

}
