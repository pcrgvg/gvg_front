import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcrIconModule } from './pcr-icon/pcr-icon.module';
import { EllipsisTextModule } from './ellipsis-text/ellipsis-text.module';
import { RaritySelectModule } from './rarity-select/rarity-select.module';
import { GithubBtnModule } from './github-btn/github-btn.module';
import { ResultItemModule } from './result-item/result-item.module';
import { NzModalService } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [PcrIconModule, RaritySelectModule, EllipsisTextModule, GithubBtnModule, ResultItemModule],
})
export class WidgetModule {}
