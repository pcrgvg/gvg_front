import { NgModule } from '@angular/core';

import { GvgRoutingModule } from './gvg-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ShareModule } from '@app/share';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LayoutModule } from '@angular/cdk/layout';

import { GvgComponent } from './gvg.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { GvgResultComponent } from './gvg-result/gvg-result.component';
import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { InstructionsComponent } from './widgets/instructions/instructions.component';
import { RaritySelectComponent } from './widgets/rarity-select/rarity-select.component';

@NgModule({
  declarations: [GvgComponent, AddTaskComponent, GvgResultComponent, AddUnHaveComponent, InstructionsComponent, RaritySelectComponent],
  imports: [
    ShareModule,
    GvgRoutingModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    CdkScrollableModule,
    MatCheckboxModule,
    LayoutModule,
    NzToolTipModule,
    NzButtonModule,
  ],
  entryComponents: [AddTaskComponent],
})
export class GvgModule {}
