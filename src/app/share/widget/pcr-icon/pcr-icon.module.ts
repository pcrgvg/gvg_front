import { NgModule } from '@angular/core';
import { PcrIconComponent } from './pcr-icon.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [PcrIconComponent],
  imports: [LazyLoadImageModule],
  exports: [PcrIconComponent],
})
export class PcrIconModule {}
