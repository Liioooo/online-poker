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
	},
	{
		path: '404',
		loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
	},
	{path: '**', redirectTo: '/404'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
