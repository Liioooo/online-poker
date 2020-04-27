import {ModuleWithProviders, NgModule} from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';
import {PopupService} from './services/popup.service';
import { CreateGamePopupComponent } from './components/popup-contents/create-game-popup/create-game-popup.component';
import { JoinGamePopupComponent } from './components/popup-contents/join-game-popup/join-game-popup.component';

@NgModule({
	declarations: [
		PopupComponent,
		CreateGamePopupComponent,
		JoinGamePopupComponent
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
