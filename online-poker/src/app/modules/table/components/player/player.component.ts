import {Component, Input, OnInit} from '@angular/core';

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

	constructor() {
	}

	ngOnInit(): void {
	}

}
