import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';
import { ServerType } from '../models';

interface Notice {
  id: number;
  content: string;
  clanBattleId: number;
  server: string;
  createTime: number;
  updateTime: number;
}

const NoticeApis = {
  getNotice: 'getNotice',
  updateNotice: 'updateNotice',
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
