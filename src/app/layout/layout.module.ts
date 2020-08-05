import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { ShareModule } from '@app/share/share.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

const components = [DefaultComponent];

@NgModule({
  declarations: [...components, HeaderComponent, FooterComponent],
  imports: [ShareModule],
  exports: [...components],
})
export class LayoutModule {}
