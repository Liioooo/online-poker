import {Component, OnInit} from '@angular/core';
import {PopupContentCompDirective} from '../../../directives/popup-content-comp.directive';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../../services/game.service';
import {CreateGameData} from '../../../models/create-game-data';

@Component({
	selector: 'app-create-game-popup',
	templateUrl: './create-game-popup.component.html',
	styleUrls: ['./create-game-popup.component.scss']
})
export class CreateGamePopupComponent extends PopupContentCompDirective<string> implements OnInit {

	public createForm: FormGroup;
	public error: string;

	constructor(private formBuilder: FormBuilder, private gameService: GameService) {
		super();
	}

	ngOnInit(): void {
		this.createForm = this.formBuilder.group({
			stackSize: [500, [Validators.required, Validators.min(1)]],
			smallBlind: [10, [Validators.required, Validators.min(1)]],
			bigBlind: [20, [Validators.required, Validators.min(1)]]
		});
	}

	public async createGameClick() {
		const gameData: CreateGameData = {
			...this.createForm.value,
			playerName: this.inputFromOpener
		}
		try {
			await this.gameService.createGame(gameData);
			this.requestClose.emit();
		} catch (e) {
			this.error = e;
		}
	}

	public close() {
		this.requestClose.emit();
	}

}
