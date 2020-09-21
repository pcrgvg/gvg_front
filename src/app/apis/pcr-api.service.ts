import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Chara, GvgTask } from '@pcrgvg/models';
import { Observable } from 'rxjs';

export const pcrApis = {
  // 获取角色列表
  charaList: '/pcr/charaList',
  gvgTaskList: '/pcr/gvgTask',
  updateGvgTask: '/pcr/updateGvgTask',
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

  gvgTaskList(stage: number = 3): Observable<GvgTask[]> {
    return this.http.Get<GvgTask[]>(pcrApis.gvgTaskList, { stage });
  }
}
