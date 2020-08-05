import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Chara } from '@pcrgvg/models';
import { Observable } from 'rxjs';

export const pcrApis = {
  charaList: '/pcr/charaList',
};

@Injectable({
  providedIn: 'root',
})
export class PcrApiService {
  constructor(private http: HttpService) {}

  charaList(): Observable<Chara[]> {
    return this.http.Get<Chara[]>(pcrApis.charaList);
  }

  updateTask(tasks): Observable<any> {
    return this.http.post(pcrApis.charaList, tasks);
  }
}
