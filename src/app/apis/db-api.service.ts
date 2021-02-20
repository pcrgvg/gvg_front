import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/net';
import { DbApis } from '../constants/apiUrls';

@Injectable({
  providedIn: 'root',
})
export class DbApiService {
  constructor(private http: HttpService) {}

  getVersion() {
    return this.http.Get<{}>(DbApis.versions);
  }
}
