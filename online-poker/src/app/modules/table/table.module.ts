import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { TableComponent } from './components/table/table.component';
import {TableRoutingModule} from './table-routing.module';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
	declarations: [TableComponent],
	imports: [
		CommonModule,
		SharedModule,
		TableRoutingModule
	]
})
export class TableModule {
}
