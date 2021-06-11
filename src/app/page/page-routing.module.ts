import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    data: {
      keepAlive: true
    },
    component: HomeComponent,
  },
  {
    path: 'gvg',
    loadChildren: () => import('./gvg/gvg.module').then((m) => m.GvgModule),
  },
  {
    path: 'about',
    component: AboutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
