import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domSanitizer',
})
export class DomSanitizerPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(value: string, ...args: unknown[]): unknown {
    return this.domSanitizer.bypassSecurityTrustHtml(value) ?? ' ';
  }
}
