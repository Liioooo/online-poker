import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HOME_ROUTES} from './modules/home/home.module';


const routes: Routes = [
	{
		path: '',
		children: HOME_ROUTES
	},
	{
		path: 'table',
		loadChildren: () => import('./modules/table/table.module').then(m => m.TableModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
