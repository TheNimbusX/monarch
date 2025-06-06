import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) { }

  getPoints(): Observable<any[]> {
    return this.http.get<any[]>('/api/points');
  }

  addPoint(point: { lat: number; lng: number; title: string; description: string }): Observable<any> {
    return this.http.post('/api/points', point);
  }

  deletePoint(id: number) {
    return this.http.delete(`/api/points/${id}`);
  }

  updatePoint(id: number, data: any) {
    return this.http.put(`/api/points/${id}`, data);
  }

}
