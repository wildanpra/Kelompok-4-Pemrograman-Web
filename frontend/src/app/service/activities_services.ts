import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Activities, ApiResponse } from '../models/Activities';

@Injectable({ providedIn: 'root' })
export class ActivitiesService extends BaseService {
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Activities[]>> {
    return this.http
      .get<ApiResponse<Activities[]>>(`${this.apiUrl}/activities`, { headers: this.getHeaders() })
      .pipe(catchError((err) => this.handleError(err)));
  }
  create(data: Partial<Activities>): Observable<ApiResponse<{ id: number }>> {
    return this.http
      .post<ApiResponse<{ id: number }>>(`${this.apiUrl}/activities`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //read semua data
  getById(id: number): Observable<ApiResponse<Activities[]>> {
    return this.http
      .get<ApiResponse<Activities[]>>(`${this.apiUrl}/activities/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //create data
  update(id: number, data: Partial<Activities>): Observable<ApiResponse<any>> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/activities/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
