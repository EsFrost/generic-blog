import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface PostData {
  title: string;
  content: string;
  image_url?: string;
}

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

  createPost(data: PostData): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, data, {
      withCredentials: true,
    });
  }

  editPost(id: string, data: PostData): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${id}`, data, {
      withCredentials: true,
    });
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`, {
      withCredentials: true,
    });
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}/posts/upload`, formData, {
      withCredentials: true,
    });
  }
}
