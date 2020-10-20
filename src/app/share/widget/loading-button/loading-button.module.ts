import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingButtonComponent } from './loading-button/loading-button.component';

@NgModule({
  declarations: [LoadingButtonComponent],
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  exports: [LoadingButtonComponent],
})
export class LoadingButtonModule {}
