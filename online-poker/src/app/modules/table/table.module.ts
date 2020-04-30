import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { TableComponent } from './components/table/table.component';
import {TableRoutingModule} from './table-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { PlayerComponent } from './components/player/player.component';
import {FormsModule} from '@angular/forms';


@NgModule({
	declarations: [TableComponent, PlayerComponent],
	imports: [
		CommonModule,
		SharedModule,
		TableRoutingModule,
		FormsModule
	]
})
export class TableModule {
}
