import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share';
import { LayoutModule } from './layout/layout.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { AppRoutingModule } from './app-routing.module';
import { IconDefinition } from '@ant-design/icons-angular';

import { PlusCircleOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [PlusCircleOutline];

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    ShareModule,
    LayoutModule,
    AppRoutingModule,
    NzIconModule.forRoot(icons),
    NzModalModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
