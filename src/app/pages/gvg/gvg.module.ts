import { NgModule } from '@angular/core';

import { GvgRoutingModule } from './gvg-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ShareModule } from '@app/share/share.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { GvgComponent } from './gvg.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';

@NgModule({
  declarations: [GvgComponent, AddTaskComponent],
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
    MatChipsModule,
  ],
  entryComponents: [AddTaskComponent],
})
export class GvgModule {}
