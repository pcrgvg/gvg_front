import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CN } from './cn';
import { EN } from './en';
import { JP } from './jp';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private _languageSetting = new BehaviorSubject('cn');
  private _languagePack =  new BehaviorSubject(CN);
  constructor() {}

  setLanguage(language: string) {
    this._languageSetting.next(language);
    this.setLanguagePack(language);
  }

  getLanguage() {
    return this._languageSetting.asObservable();
  }

  getLanguageValue() {
    return this._languageSetting.getValue();
  }

  getLanguagePackObs() {
    return this._languagePack.asObservable();
  }

  getLanguagePackValue() {
    return this._languagePack.getValue();
  }

  setLanguagePack(language: string) {
    if (language === 'jp') {
      this._languagePack.next(JP);
    }
    else if (language === 'en') {
      this._languagePack.next(EN);
    } else {
      this._languagePack.next(CN);
    }
  }
}
