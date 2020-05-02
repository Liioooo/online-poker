import {
	ApplicationRef,
	ComponentFactoryResolver, ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	Type
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {PopupContentCompDirective} from '../directives/popup-content-comp.directive';
import {PopupComponent} from '../components/popup/popup.component';

@Injectable({
	providedIn: 'root'
})
export class PopupService {

	private _popupRef: ComponentRef<PopupComponent>;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		@Inject(DOCUMENT) private document: Document
	) { }

	public showPopup(
		popupContentComp: Type<PopupContentCompDirective>,
		title: string,
		closeOnClickOutside: boolean,
		contentComponentInput?: any,
		componentFactoryResolver?: ComponentFactoryResolver
	): Promise<any> {
		return new Promise<void>(resolve => {
			componentFactoryResolver = componentFactoryResolver ? componentFactoryResolver : this.componentFactoryResolver;
			const popupFactory = componentFactoryResolver.resolveComponentFactory(PopupComponent);
			this._popupRef = popupFactory.create(this.injector);
			this._popupRef.instance.title = title;
			this._popupRef.instance.closeOnClickOutside = closeOnClickOutside;
			this._popupRef.instance.contentCompInput = contentComponentInput;
			this._popupRef.instance.contentComp = componentFactoryResolver.resolveComponentFactory(popupContentComp);
			this.appRef.attachView(this._popupRef.hostView);
			const domElem = (this._popupRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
			this.document.body.appendChild(domElem);

			const subscription = this._popupRef.instance.requestClose.subscribe(output => {
				this.appRef.detachView(this._popupRef.hostView);
				delete this._popupRef;
				resolve(output);
				subscription.unsubscribe();
				if (!!this._popupRef)
					this._popupRef.destroy();
			});
			this._popupRef.onDestroy(() => {
				subscription.unsubscribe();
				resolve();
			})
		});
	}

	public get isPopupOpened(): boolean {
		return !!this._popupRef;
	}

	public closePopups() {
		if (!!this._popupRef)
			this._popupRef.destroy();
	}
}
