import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';

import { ShareModule } from '@app/share';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [TestComponent],
  imports: [PagesRoutingModule, ShareModule],
})
export class PagesModule {}
