import {ModuleWithProviders, NgModule} from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';
import {PopupService} from './services/popup.service';
import { CreateGamePopupComponent } from './components/popup-contents/create-game-popup/create-game-popup.component';
import { JoinGamePopupComponent } from './components/popup-contents/join-game-popup/join-game-popup.component';
import { FooterComponent } from './components/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AskForNameComponent } from './components/popup-contents/ask-for-name/ask-for-name.component';
import { ErrorComponent } from './components/popup-contents/error/error.component';

@NgModule({
	declarations: [
		PopupComponent,
		CreateGamePopupComponent,
		JoinGamePopupComponent,
		FooterComponent,
		AskForNameComponent,
		ErrorComponent
	],
	exports: [
		PopupComponent,
		FooterComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
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
