import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/points`);
  }

  addPoint(point: { lat: number; lng: number; title: string; description: string }): Observable<any> {
    return this.http.post(`${this.api}/points`, point);
  }

  deletePoint(id: number) {
    return this.http.delete(`${this.api}/points/${id}`);
  }

  updatePoint(id: number, data: any) {
    return this.http.put(`${this.api}/points/${id}`, data);
  }
}
