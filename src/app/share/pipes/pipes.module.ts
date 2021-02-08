import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanautoPipe } from './canauto.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';

@NgModule({
  declarations: [CanautoPipe, DomSanitizerPipe],
  imports: [CommonModule],
  exports: [CanautoPipe, DomSanitizerPipe],
})
export class PipesModule {}
