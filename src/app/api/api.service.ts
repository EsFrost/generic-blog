import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  //   createData(data: any): Observable<any> {
  //     return this.http.post(`${this.apiUrl}/posts`, data);
  //   }
}
