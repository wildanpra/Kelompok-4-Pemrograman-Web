// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../service/Service'; // Pastikan path benar

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  login(data: any) {
    // apiUrl diambil dari BaseService
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
