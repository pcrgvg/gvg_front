import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/net';
import { Observable } from 'rxjs';
import { pcrApis } from '../constants/apiUrls';
import { Chara, GvgTask, ServerType } from '../models';
import { CnTask } from '../models/cnTask';

@Injectable({
  providedIn: 'root',
})
export class PcrApiService {
  constructor(private http: HttpService) {}

  charaList(serverType: ServerType): Observable<Chara[]> {
    return this.http.Get<Chara[]>(pcrApis.charaList, { server: serverType });
  }

  updateTask(gvgTask: GvgTask): Observable<GvgTask[]> {
    return this.http.post<GvgTask[]>(pcrApis.updateGvgTask, gvgTask);
  }

  gvgTaskList(stage: number = 3, serverType: string, clanBattleId: number): Observable<GvgTask[]> {
    return this.http.post<GvgTask[]>(pcrApis.gvgTaskList, {
      stage,
      server: serverType,
      clanBattleId,
    });
  }

  deleteTask(id: number, server: string): Observable<boolean> {
    return this.http.delete<boolean>(pcrApis.deleteTask, { params: { id: id.toString(), server } });
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

  updateCnTask() {
    return this.http.put<number[]>(pcrApis.updateCnTask, {});
  }

  getCnTask() {
    return this.http.get<CnTask[]>(pcrApis.getCnTask);
  }
}
