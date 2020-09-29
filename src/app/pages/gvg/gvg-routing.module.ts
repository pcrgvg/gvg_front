import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvgResultComponent } from './gvg-result/gvg-result.component';
import { GvgComponent } from './gvg.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
  },
  {
    path: 'gvgresult',
    component: GvgResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
