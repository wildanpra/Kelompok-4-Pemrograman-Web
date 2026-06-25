import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Contact, ApiResponse } from '../models/Contact';

@Injectable({ providedIn: 'root' })
export class ContactService extends BaseService {
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Contact[]>> {
    return this.http
      .get<ApiResponse<Contact[]>>(`${this.apiUrl}/contacts`, { headers: this.getHeaders() })
      .pipe(catchError((err) => this.handleError(err)));
  }
  create(data: Partial<Contact>): Observable<ApiResponse<{ id: number }>> {
    return this.http
      .post<ApiResponse<{ id: number }>>(`${this.apiUrl}/contacts`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  update(id: number, data: Partial<Contact>): Observable<ApiResponse<any>> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/contacts/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/contacts/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
