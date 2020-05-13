import {Component, Input} from '@angular/core';
import {Player} from '../../../../shared/models/player';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

	@Input()
	public positionX: number;

	@Input()
	public positionY: number;

	@Input()
	public player: Player;

	public get dealerTranslate(): string {
		if (!this.player.isPlayer) {
			return 'translate(50%, -50%)';
		}
		return 'translate(-25%, -50%)';
	}

}
