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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { NgxWigModule } from 'ngx-wig';

import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { GvgResultComponent } from './gvg-result/gvg-result.component';
import { DeleteComfirmComponent } from './widgets/delete-comfirm/delete-comfirm.component';
import { NoticeComponent } from './widgets/notice/notice.component';


import { PlusCircleOutline } from '@ant-design/icons-angular/icons';
import { UnHaveCharaComponent } from './gvg/un-have-chara/un-have-chara.component';
import { BillboardComponent } from './gvg/billboard/billboard.component';
import { TaskItemComponent } from './widgets/task-item/task-item.component';
import { ResultDetailComponent } from './result-detail/result-detail.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { LinkButtonComponent } from './widgets/link-button/link-button.component';

import { DragDropModule } from '@angular/cdk/drag-drop';




@NgModule({
  declarations: [
    GvgComponent,
    AddUnHaveComponent,
    AddTaskComponent,
    GvgResultComponent,
    DeleteComfirmComponent,
    NoticeComponent,
    UnHaveCharaComponent,
    BillboardComponent,
    TaskItemComponent,
    ResultDetailComponent,
    TaskDetailComponent,
    LinkButtonComponent,
  ],
  imports: [
    ShareModule,
    NzToolTipModule,
    NzModalModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NgxWigModule,
    NzInputModule,
    CdkScrollableModule,
    NzTabsModule,
    GvgRoutingModule,
    NzSelectModule,
    NzCollapseModule,
    NzButtonModule,
    NzFormModule,
    NzCheckboxModule,
    NzSpinModule,
    NzIconModule.forChild([PlusCircleOutline]),
    NzImageModule,
    NzDropDownModule,
    DragDropModule
  ],
})
export class GvgModule {}
