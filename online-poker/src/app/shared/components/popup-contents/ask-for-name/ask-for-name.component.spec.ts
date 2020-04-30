import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AskForNameComponent} from './ask-for-name.component';

describe('AskForNameComponent', () => {
	let component: AskForNameComponent;
	let fixture: ComponentFixture<AskForNameComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AskForNameComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AskForNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
