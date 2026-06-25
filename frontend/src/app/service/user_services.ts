import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { User, ApiResponse } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  // Pastikan constructor menerima PLATFORM_ID untuk diteruskan ke super (BaseService)
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.apiUrl}/users`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(data: Partial<User>): Observable<ApiResponse<{ id: number }>> {
    return this.http
      .post<ApiResponse<{ id: number }>>(`${this.apiUrl}/users`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
