import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './Service';
import { Contact } from '../models/Contact';
import { ApiResponse } from '../models/Customer';

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
}
