import { OnInit, Pipe, PipeTransform } from '@angular/core';
import { CanAutoType, CanAutoName } from '@app/models';
import { CN, I18nService, LanguagePack } from '@app/core/services/I18n';

@Pipe({
  name: 'canauto',
  pure: false
})
export class CanautoPipe implements PipeTransform {

  constructor( private I18nService: I18nService) {
    this.I18nService.getLanguagePackObs().subscribe(r => {
      this.common = r.common;
    })
  }
  transform(value: CanAutoType, ...args: unknown[]): string {
    switch (value) {
      case CanAutoType.auto:
        return this.common.auto;
      case CanAutoType.manual:
        return this.common.manual;
      case CanAutoType.harfAuto:
        return this.common.semiAutomatic;
      default:
        return '';
    }
  }
  common = CN.common;
}
