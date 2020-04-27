import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinGamePopupComponent} from './join-game-popup.component';

describe('JoinGamePopupComponent', () => {
	let component: JoinGamePopupComponent;
	let fixture: ComponentFixture<JoinGamePopupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [JoinGamePopupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JoinGamePopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
