import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from "@angular/router";
import { HomeComponent } from './components/home/home.component';


export const HOME_ROUTES: Routes = [
	{
		path: '',
		component: HomeComponent
	},
];

@NgModule({
	declarations: [HomeComponent],
	imports: [
		CommonModule
	]
})
export class HomeModule {
}
