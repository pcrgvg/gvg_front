import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';
import { Chara, GvgTask } from '../models';

export const pcrApis = {
  // 获取角色列表
  charaList: '/pcr/charaList',
  gvgTaskList: '/pcr/gvgTask',
  updateGvgTask: '/pcr/updateGvgTask',
  deleteTask: '/pcr/deleteTask',
  getRank: '/pcr/rank',
  getClanBattleList: '/pcr/clanBattleList',
};

@Injectable({
  providedIn: 'root',
})
export class PcrApiService {
  constructor(private http: HttpService) {}

  charaList(): Observable<Chara[]> {
    return this.http.Get<Chara[]>(pcrApis.charaList);
  }

  updateTask(gvgTask: GvgTask): Observable<GvgTask> {
    return this.http.post<GvgTask>(pcrApis.updateGvgTask, gvgTask);
  }

  gvgTaskList(stage: number = 3, serverType: string, clanBattleId: number): Observable<GvgTask[]> {
    return this.http.Get<GvgTask[]>(pcrApis.gvgTaskList, { stage, server: serverType, clanBattleId });
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(pcrApis.deleteTask, { params: { id: id.toString() } });
  }

  getRank(): Observable<number[]> {
    return this.http.Get<number[]>(pcrApis.getRank);
  }

  getClanBattleList(): Observable<
    {
      clanBattleId: number;
      startTime: string;
    }[]
  > {
    return this.http.Get<
      {
        clanBattleId: number;
        startTime: string;
      }[]
    >(pcrApis.getClanBattleList);
  }
}
