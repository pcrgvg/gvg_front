import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './loading-button/loading-button.component';

@NgModule({
  declarations: [LoadingButtonComponent],
  imports: [CommonModule, ],
  exports: [LoadingButtonComponent],
})
export class LoadingButtonModule {}
