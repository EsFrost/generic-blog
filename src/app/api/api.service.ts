import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`);
  }

  createPost(data: { title: string; content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, data, {
      withCredentials: true,
    });
  }

  editPost(
    id: string,
    data: { title: string; content: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${id}`, data, {
      withCredentials: true,
    });
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`, {
      withCredentials: true,
    });
  }
}
