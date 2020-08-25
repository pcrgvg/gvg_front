import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from './directives/directives.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WidgetModule } from './widget/widget.module';
import { PipesModule } from './pipes/pipes.module';

const commonModule = [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, OverlayModule];

const exportModuel = [WidgetModule, DirectivesModule, PipesModule];

@NgModule({
  declarations: [],
  imports: [...commonModule],
  exports: [...commonModule, ...exportModuel],
})
export class ShareModule {}
