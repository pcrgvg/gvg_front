import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/net';
import { Observable } from 'rxjs';
import { NoticeApis } from '../constants/apiUrls';
import { Notice, ServerType } from '../models';


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
