import { Injectable } from '@angular/core';
import { BaseService } from '../service/Service'; // Sesuaikan path-nya
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseService {
  getSummary(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
