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

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(pcrApis.deleteTask, { params: { id: id.toString() } });
  }
}
