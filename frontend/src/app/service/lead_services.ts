import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Lead, ApiResponse } from '../models/Lead';

@Injectable({ providedIn: 'root' })
export class LeadService extends BaseService {
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Lead[]>> {
    return this.http
      .get<ApiResponse<Lead[]>>(`${this.apiUrl}/leads`, { headers: this.getHeaders() })
      .pipe(catchError((err) => this.handleError(err)));
  }

  create(data: Partial<Lead>): Observable<ApiResponse<{ id: number }>> {
    return this.http
      .post<ApiResponse<{ id: number }>>(`${this.apiUrl}/leads`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<Lead>): Observable<ApiResponse<any>> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/leads/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/leads/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
