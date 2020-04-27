import {ModuleWithProviders, NgModule} from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';
import {PopupService} from './services/popup.service';

@NgModule({
	declarations: [
		PopupComponent
	],
	exports: [
		PopupComponent
	],
	imports: []
})
export class SharedModule {
	static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				PopupService
			]
		}
	}
}
