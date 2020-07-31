import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from '@app/core/core.module';
import { PagesModule } from '@app/pages/pages.module';
import { ShareModule } from '@app/share/share.module';
import { LayoutModule } from '@app/layout/layout.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ShareModule,
    LayoutModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
