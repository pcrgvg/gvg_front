import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';
import { ServerType } from '../models';

interface Changelog {
  content: string;
}

const ChangelogApis = {
  getChangeLog: '/pcr/getChangeLog',
};

@Injectable({
  providedIn: 'root',
})
export class ChangelogServiceApi {
  constructor(private http: HttpService) {}
  getChangeLog() {
    return this.http.Get<Changelog>(ChangelogApis.getChangeLog);
  }
}
