import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../service/Service'; // Pastikan path benar
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  //tambahkan ini
  constructor(
    http: HttpClient,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    super(http, platform); // teruskan ke BaseService seperti biasa
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platform);
  }

  login(data: any) {
    // apiUrl diambil dari BaseService
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  //ubah bagian logout
  logout(): void {
    // Hapus token hanya di browser, agar aman saat dijalankan di server
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  //ubah bagian isLoggedIn
  isLoggedIn(): boolean {
    // Di server tidak ada localStorage -> anggap belum login
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  //tambahkan ini
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }
}
