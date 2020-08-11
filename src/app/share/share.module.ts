import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from './directives/directives.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const commonModule = [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DirectivesModule, MatSnackBarModule, OverlayModule];

@NgModule({
  declarations: [],
  imports: [...commonModule],
  exports: [...commonModule],
})
export class ShareModule {}
