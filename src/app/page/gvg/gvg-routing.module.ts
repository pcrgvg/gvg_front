import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvgComponent } from './gvg/gvg.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
    data: {
      keepAlive: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
