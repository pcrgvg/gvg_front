import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { GvgComponent } from './gvg/gvg.component';

const routes: Routes = [
  {
    path: '',
    component: GvgComponent,
    data: {
      // keepAlive: true,
    },
  },
  {
    path: 'addTask',
    component: AddTaskComponent,
   
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GvgRoutingModule {}
