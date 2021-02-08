import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/net';
import { ChangelogApis } from '../constants/apiUrls';

interface Changelog {
  content: string;
}


@Injectable({
  providedIn: 'root',
})
export class ChangelogServiceApi {
  constructor(private http: HttpService) {}
  getChangeLog() {
    return this.http.Get<Changelog>(ChangelogApis.getChangeLog);
  }
}
