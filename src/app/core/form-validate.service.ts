import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidateService {
  constructor() {}

  formIsValid(validateForm: FormGroup): boolean {
    for (const i in validateForm.controls) {
      if (validateForm.controls.hasOwnProperty(i) && !validateForm.controls[i].disabled) {
        // validateForm.controls[i].clearAsyncValidators();
        validateForm.controls[i].markAsDirty();
        validateForm.controls[i].updateValueAndValidity();
        if (validateForm.controls[i] instanceof FormArray) {
          for (const control of (validateForm.controls[i] as FormArray).controls) {
            this.formIsValid(control as FormGroup);
          }
        }
      }
    }
    return validateForm.valid;
  }
}
