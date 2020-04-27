import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';

@Component({
	selector: 'app-join-game-popup',
	templateUrl: './join-game-popup.component.html',
	styleUrls: ['./join-game-popup.component.scss']
})
export class JoinGamePopupComponent extends PopupContentCompDirective implements OnInit {

	constructor() {
		super();
	}

	ngOnInit(): void {
	}

}
