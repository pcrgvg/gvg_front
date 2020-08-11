import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopModule } from './click-stop/click-stop.module';
import { ContextmuneModule } from './contextmenu/contextmenu.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [ClickStopModule, ContextmuneModule],
})
export class DirectivesModule {}
