import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanautoPipe } from './canauto.pipe';
import { I18nPipe } from './i18n.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';

@NgModule({
  declarations: [CanautoPipe, I18nPipe, DomSanitizerPipe],
  imports: [CommonModule],
  exports: [CanautoPipe, I18nPipe, DomSanitizerPipe],
})
export class PipesModule {}
