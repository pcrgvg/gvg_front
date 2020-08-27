import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  locale = new BehaviorSubject<string>('en');
  constructor() {}

  changeLanguage(language: string) {
    this.locale.next(language);
  }

  getLanguage() {
    return this.locale.asObservable();
  }
}
