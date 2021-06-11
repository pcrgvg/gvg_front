import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { ShareModule } from '@app/share';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

const components = [DefaultComponent];

@NgModule({
  declarations: [...components, HeaderComponent, FooterComponent],
  imports: [ShareModule, NzModalModule, NzButtonModule],
  exports: [...components],
})
export class LayoutModule {}
