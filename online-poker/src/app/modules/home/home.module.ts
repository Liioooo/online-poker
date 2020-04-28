import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';


export const HOME_ROUTES: Routes = [
	{
		path: '',
		component: HomeComponent
	},
];

@NgModule({
	declarations: [HomeComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule
	]
})
export class HomeModule {
}
