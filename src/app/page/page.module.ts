import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { PageRoutingModule } from './page-routing.module';
import { HomeComponent } from './home/home.component';
import { ShareModule } from '@app/share';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [HomeComponent, AboutComponent],
  imports: [ShareModule, PageRoutingModule, NzButtonModule, NzToolTipModule],
})
export class PageModule {}
