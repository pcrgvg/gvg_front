import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';

import { ShareModule } from '@app/share/share.module';

@NgModule({
  declarations: [],
  imports: [PagesRoutingModule, ShareModule],
})
export class PagesModule {}
