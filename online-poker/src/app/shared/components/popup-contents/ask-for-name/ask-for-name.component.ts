import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';

@Component({
	selector: 'app-ask-for-name',
	templateUrl: './ask-for-name.component.html',
	styleUrls: ['./ask-for-name.component.scss']
})
export class AskForNameComponent extends PopupContentCompDirective implements OnInit {

	public name: string;

	constructor() {
		super();
	}

	ngOnInit(): void {
	}

	public close() {
		this.requestClose.emit(null);
	}

	public joinGameClick() {
		this.requestClose.emit(this.name);
	}

}
