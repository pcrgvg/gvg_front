import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';
import { Notice, ServerType } from '../models';

const NoticeApis = {
  getNotice: '/pcr/getNotice',
  updateNotice: '/pcr/updateNotice',
};

@Injectable({
  providedIn: 'root',
})
export class NoticeApiService {
  constructor(private http: HttpService) {}

  getNotice(params: { server: ServerType; clanBattleId: number }) {
    return this.http.Get<Notice>(NoticeApis.getNotice, params);
  }

  updateNotice(notice: Notice) {
    return this.http.post<Notice>(NoticeApis.updateNotice, notice);
  }
}
