import { OnInit, Pipe, PipeTransform } from '@angular/core';
import { CanAutoType, CanAutoName } from '@app/models';
import { CN, I18nService, LanguagePack } from '@app/core/services/I18n';

@Pipe({
  name: 'canauto',
})
export class CanautoPipe implements PipeTransform {
  transform(value: CanAutoType, ...args: [LanguagePack['common']]): string {
    const common = args[0];
    switch (value) {
      case CanAutoType.auto:
        return common.auto;
      case CanAutoType.manual:
        return common.manual;
      case CanAutoType.harfAuto:
        return common.semiAutomatic;
      default:
        return '';
    }
  }
}
