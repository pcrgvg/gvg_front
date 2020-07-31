import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from './directives/directives.module';


const commonModule = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  DirectivesModule
];


@NgModule({
  declarations: [],
  imports: [
    ...commonModule
  ],
  exports: [
    ...commonModule
  ]
})
export class ShareModule { }
