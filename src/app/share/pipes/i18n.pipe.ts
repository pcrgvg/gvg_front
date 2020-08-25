import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { I18nService } from '@core';
import { Subscription } from 'rxjs';

export const en = {
  confirm: 'confirm',
};

export const cn = {
  confirm: '确定',
};

@Pipe({
  name: 'i18n',
})
export class I18nPipe implements PipeTransform, OnDestroy {
  cn = {
    confirm: '确定',
  };
  en = {
    confirm: 'confirm',
  };
  language: string;
  sub: Subscription;
  constructor(private i18n: I18nService) {
    this.sub = this.i18n.getLanguage().subscribe((res) => {
      this.language = res;
    });
  }
  transform(value: string, ...args: unknown[]): unknown {
    return this[this.language][value];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
