import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanautoPipe } from './canauto.pipe';
import { I18nPipe } from './i18n.pipe';

@NgModule({
  declarations: [CanautoPipe, I18nPipe],
  imports: [CommonModule],
  exports: [CanautoPipe, I18nPipe],
})
export class PipesModule {}
