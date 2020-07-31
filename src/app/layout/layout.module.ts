import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { ShareModule } from '@app/share/share.module';

const components = [
  DefaultComponent
];


@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    ShareModule
  ],
  exports: [
    ...components
  ]
})
export class LayoutModule { }
