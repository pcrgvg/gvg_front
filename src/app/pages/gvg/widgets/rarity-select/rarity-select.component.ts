import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RaritySelectComponent),
  multi: true,
};

@Component({
  selector: 'app-rarity-select',
  templateUrl: './rarity-select.component.html',
  styleUrls: ['./rarity-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SELECT_VALUE_ACCESSOR],
})
export class RaritySelectComponent implements OnInit, ControlValueAccessor {
  @Input() maxRarity: number = 5;

  @Input() _value;
  disabeld = false;
  starArray = [];

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.starArray = new Array(this.maxRarity);
  }

  onTouched = (_: any) => {};
  onChange = (_: any) => {};

  setValue(value: number, emit = true) {
    this._value = value;
    if (emit) {
      this.onChange(value);
    }
    this._cdr.markForCheck();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    this.setValue(value, false);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabeld = isDisabled;
    this._cdr.markForCheck();
  }

  starSrc(index: number) {
    if (this._value >= index + 1) {
      return '/assets/images/star.png';
    }
    return '/assets/images/star_disabled.png';
  }

  changeRarity(index: number) {
    this.setValue(index);
  }
}
