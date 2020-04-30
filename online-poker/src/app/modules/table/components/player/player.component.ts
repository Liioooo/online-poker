import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../../../shared/models/player';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

	@Input()
	public positionX: number;

	@Input()
	public positionY: number;

	@Input()
	public player: Player;

	constructor() {
	}

	ngOnInit(): void {
	}

}
