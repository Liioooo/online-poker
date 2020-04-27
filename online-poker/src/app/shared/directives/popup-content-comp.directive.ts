import {EventEmitter, Input, Output, Directive} from '@angular/core';

@Directive()
export abstract class PopupContentCompDirective<T = any> {

	@Output()
	requestClose: EventEmitter<any> = new EventEmitter<any>();

	@Input()
	inputFromOpener: T;
}
