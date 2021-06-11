import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { PageRoutingModule } from './page-routing.module';
import { HomeComponent } from './home/home.component';
import { ShareModule } from '@app/share';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [HomeComponent, AboutComponent],
  imports: [ShareModule, PageRoutingModule, NzButtonModule],
})
export class PageModule {}
