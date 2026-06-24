import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { User } from '../models/User';
import { ApiResponse } from '../models/Customer';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.apiUrl}/users`, { headers: this.getHeaders() })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
