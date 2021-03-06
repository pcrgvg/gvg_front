import { Pipe, PipeTransform } from '@angular/core';
import { CanAutoType, CanAutoName } from '@app/models';
@Pipe({
  name: 'canauto',
})
export class CanautoPipe implements PipeTransform {
  transform(value: CanAutoType, ...args: unknown[]): string {
    switch (value) {
      case CanAutoType.auto:
        return CanAutoName.auto;
      case CanAutoType.unAuto:
        return CanAutoName.unAuto;
      case CanAutoType.harfAuto:
        return CanAutoName.harfAuto;
      default:
        return '';
    }
  }
}
