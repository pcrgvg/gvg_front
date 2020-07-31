import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { GvgComponent } from './gvg/gvg.component';
import { ShareModule } from '@app/share/share.module';


@NgModule({
  declarations: [GvgComponent],
  imports: [
    PagesRoutingModule,
    ShareModule
  ]
})
export class PagesModule { }
