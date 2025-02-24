import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://sigmafi-tech.website/genericapi';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists in localStorage on service initialization
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/users/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/login']);
        })
      );
  }
}
