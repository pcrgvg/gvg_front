import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';
import { Chara, GvgTask, ServerType } from '../models';

export const pcrApis = {
  // 获取角色列表
  charaList: '/pcr/charaList',
  gvgTaskList: '/pcr/gvgTask',
  updateGvgTask: '/pcr/updateGvgTask',
  deleteTask: '/pcr/deleteTask',
  getRank: '/pcr/rank',
  getClanBattleList: '/pcr/clanBattleList',
  stageScore: '/pcr/getStageScore',
};

@Injectable({
  providedIn: 'root',
})
export class PcrApiService {
  constructor(private http: HttpService) {}

  charaList(serverType: ServerType): Observable<Chara[]> {
    return this.http.Get<Chara[]>(pcrApis.charaList, { server: serverType });
  }

  updateTask(gvgTask: GvgTask): Observable<GvgTask> {
    return this.http.post<GvgTask>(pcrApis.updateGvgTask, gvgTask);
  }

  gvgTaskList(stage: number = 3, serverType: string, clanBattleId: number): Observable<GvgTask[]> {
    return this.http.Get<GvgTask[]>(pcrApis.gvgTaskList, {
      stage,
      server: serverType,
      clanBattleId,
    });
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(pcrApis.deleteTask, { params: { id: id.toString() } });
  }

  getRank(server: ServerType): Observable<number[]> {
    return this.http.Get<number[]>(pcrApis.getRank, { server });
  }
  /**
   * 获取会战期次
   */
  getClanBattleList(
    server: ServerType,
  ): Observable<
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
    >(pcrApis.getClanBattleList, { server });
  }

  stageScore(server: string, clanBattleId: number) {
    return this.http.Get<number[]>(pcrApis.stageScore, { server, clanBattleId });
  }
}
