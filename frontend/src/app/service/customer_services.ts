import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Customer, ApiResponse } from '../models/Customer';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService {
  // Pastikan constructor menerima PLATFORM_ID untuk diteruskan ke super (BaseService)
  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Customer[]>> {
    return this.http
      .get<ApiResponse<Customer[]>>(`${this.apiUrl}/customers`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
