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
        if (!validateForm.controls[i].valid) {
          // TODO;
        }
        validateForm.controls[i].clearAsyncValidators();
        validateForm.controls[i].markAsDirty();
        validateForm.controls[i].updateValueAndValidity();
        if (validateForm.controls[i] instanceof FormArray) {
          for (const control of (<FormArray>validateForm.controls[i]).controls) {
            this.formIsValid(<FormGroup>control);
          }
        }
      }
    }
    return validateForm.valid;
  }

  markFormDirty(validateForm: FormGroup) {
    for (const i in validateForm.controls) {
      if (validateForm.controls.hasOwnProperty(i) && !validateForm.controls[i].disabled) {
        validateForm.controls[i].markAsDirty();
        validateForm.controls[i].updateValueAndValidity();
        if (validateForm.controls[i] instanceof FormArray) {
          for (const control of (<FormArray>validateForm.controls[i]).controls) {
            this.markFormDirty(<FormGroup>control);
          }
        }
      }
    }
  }
}
