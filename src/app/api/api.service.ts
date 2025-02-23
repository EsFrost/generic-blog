import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface PostData {
  title: string;
  content: string;
  image_url?: string;
}

interface CategoryData {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://sigmafi-tech.website/genericapi';

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

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  createCategory(data: CategoryData): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, data, {
      withCredentials: true,
    });
  }

  updateCategory(id: string, data: CategoryData): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, data, {
      withCredentials: true,
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`, {
      withCredentials: true,
    });
  }

  // Post-Category relationship methods
  getPostCategories(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}/categories`);
  }

  addCategoryToPost(postId: string, categoryId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/categories/${categoryId}`,
      {},
      { withCredentials: true }
    );
  }

  removeCategoryFromPost(postId: string, categoryId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/posts/${postId}/categories/${categoryId}`,
      { withCredentials: true }
    );
  }
}
