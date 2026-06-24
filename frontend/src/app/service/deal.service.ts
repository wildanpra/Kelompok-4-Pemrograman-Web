import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Deal } from '../models/Deal';
import { ApiResponse } from '../models/Customer';

@Injectable({ providedIn: 'root' })
export class DealService extends BaseService {
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Deal[]>> {
    return this.http
      .get<ApiResponse<Deal[]>>(`${this.apiUrl}/deals`, { headers: this.getHeaders() })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
