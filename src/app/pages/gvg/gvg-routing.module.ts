import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvgComponent } from './gvg.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
