import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImageFile {
  name: string;
  url: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/images';

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      withCredentials: true,
    });
  }

  getImages(): Observable<{ files: ImageFile[] }> {
    return this.http.get<{ files: ImageFile[] }>(`${this.apiUrl}/list`, {
      withCredentials: true,
    });
  }

  deleteImage(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${filename}`, {
      withCredentials: true,
    });
  }
}
