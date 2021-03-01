import { NgModule } from '@angular/core';
import { ShareModule } from '@app/share';

import { GvgRoutingModule } from './gvg-routing.module';
import { AddTaskComponent } from './add-task/add-task.component';
import { GvgComponent } from './gvg/gvg.component';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';



@NgModule({
  declarations: [AddTaskComponent, GvgComponent],
  imports: [ShareModule, GvgRoutingModule, NzSelectModule, NzCollapseModule, NzButtonModule, NzFormModule],
})
export class GvgModule { }
