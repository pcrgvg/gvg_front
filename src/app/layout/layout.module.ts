import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { ShareModule } from '@app/share';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DownCircleOutline, GlobalOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

const components = [DefaultComponent];

@NgModule({
  declarations: [...components, HeaderComponent, FooterComponent],
  imports: [
    ShareModule,
    NzModalModule,
    NzButtonModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzIconModule.forChild([GlobalOutline, DownCircleOutline, SettingOutline]),
  ],
  exports: [...components],
})
export class LayoutModule {}
