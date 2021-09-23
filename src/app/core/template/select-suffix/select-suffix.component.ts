import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'pcr-select-suffix',
  templateUrl: './select-suffix.component.html',
  styleUrls: ['./select-suffix.component.scss']
})
export class SelectSuffixComponent {
  @ViewChild('nzSelectSuffixTpl', { static: true })
  nzSelectSuffix!: TemplateRef<void>;

  constructor() { }


}
