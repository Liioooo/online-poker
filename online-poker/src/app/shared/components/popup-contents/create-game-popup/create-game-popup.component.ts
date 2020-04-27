import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';

@Component({
	selector: 'app-craete-game-popup',
	templateUrl: './craete-game-popup.component.html',
	styleUrls: ['./craete-game-popup.component.scss']
})
export class CreateGamePopupComponent extends PopupContentCompDirective implements OnInit {

	constructor() {
		super();
	}

	ngOnInit(): void {
	}

}
