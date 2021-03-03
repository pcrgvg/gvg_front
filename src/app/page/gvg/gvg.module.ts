import { NgModule } from '@angular/core';
import { ShareModule } from '@app/share';

import { GvgRoutingModule } from './gvg-routing.module';
import { GvgComponent } from './gvg/gvg.component';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { GvgResultComponent } from './gvg-result/gvg-result.component';
import { DeleteComfirmComponent } from './widgets/delete-comfirm/delete-comfirm.component';




@NgModule({
  declarations: [GvgComponent, AddUnHaveComponent, AddTaskComponent, GvgResultComponent, DeleteComfirmComponent],
  imports: [
    ShareModule,
    NzIconModule, NzToolTipModule,
    NzModalModule, NzInputNumberModule,
    NzInputModule, CdkScrollableModule, NzTabsModule, GvgRoutingModule, NzSelectModule, NzCollapseModule, NzButtonModule, NzFormModule, NzCheckboxModule
  ],
})
export class GvgModule { }
