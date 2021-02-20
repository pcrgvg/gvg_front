import { NgModule } from '@angular/core';
import { ShareModule } from '@app/share';

import { GvgRoutingModule } from './gvg-routing.module';
import { AddTaskComponent } from './add-task/add-task.component';
import { GvgComponent } from './gvg/gvg.component';

@NgModule({
  declarations: [AddTaskComponent, GvgComponent],
  imports: [ShareModule, GvgRoutingModule],
})
export class GvgModule {}
