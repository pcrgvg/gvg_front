import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvgComponent } from './gvg/gvg.component';
import { GvgResultComponent } from './gvg-result/gvg-result.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
    data: {
      keepAlive: true,
    },
  },
  {
    path: 'result',
    component: GvgResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
