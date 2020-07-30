import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreInterceptor } from './net/core.interceptor';
import { CoreErrorHandler } from './core-error-handler';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CoreInterceptor, multi: true },
    { provide: ErrorHandler, useClass: CoreErrorHandler },
  ]
})
export class CoreModule { }
