import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Activities } from '../models/Activities';
import { ApiResponse } from '../models/Customer';

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
}
