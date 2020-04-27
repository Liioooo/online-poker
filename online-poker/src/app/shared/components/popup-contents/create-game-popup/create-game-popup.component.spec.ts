import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateGamePopupComponent} from './create-game-popup.component';

describe('CraeteGamePopupComponent', () => {
	let component: CreateGamePopupComponent;
	let fixture: ComponentFixture<CreateGamePopupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CreateGamePopupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateGamePopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
