import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvgComponent } from './gvg/gvg.component';
import { GvgResultComponent } from './gvg-result/gvg-result.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
  },
  {
    path: 'result',
    component: GvgResultComponent,
  },
  {
    path: 'task-detail',
    component: TaskDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
