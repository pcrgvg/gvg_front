import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GvgRoutingModule } from './gvg-routing.module';
import { AddTaskComponent } from './add-task/add-task.component';
import { GvgComponent } from './gvg/gvg.component';


@NgModule({
  declarations: [AddTaskComponent, GvgComponent],
  imports: [
    CommonModule,
    GvgRoutingModule
  ]
})
export class GvgModule { }
