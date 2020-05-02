import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent extends PopupContentCompDirective<string> implements OnInit {

	public error: string;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.error = this.inputFromOpener;
	}

	public close() {
		this.requestClose.emit();
	}

}
