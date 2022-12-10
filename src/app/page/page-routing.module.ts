import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { CollectpageComponent } from './collectpage/collectpage.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'gvg',
    loadChildren: () => import('./gvg/gvg.module').then((m) => m.GvgModule),
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'collect',
    component: CollectpageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
