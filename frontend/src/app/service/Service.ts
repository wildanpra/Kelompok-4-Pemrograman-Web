import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Contact } from '../models/Contact';
import { User } from '../models/User';
import { Activities } from '../models/Activities';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseService {
  protected apiUrl = 'http://localhost:3000';
  constructor(
    protected http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-type': 'application/json' });
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }
  protected handleError(error: any): Observable<never> {
    console.log('API Error:', error);
    if (error?.status === 401 && isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return throwError(() => error);
  }
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private contacts: Contact[] = [
    {
      id: 1,
      customer_id: 1,
      name: 'Budi Santoso',
      email: 'budi@mail.com',
      phone: '08123',
      position: 'Active',
    },
    {
      id: 2,
      customer_id: 2,
      name: 'Siti Aminah',
      email: 'siti@mail.com',
      phone: '08124',
      position: 'Inactive',
    },
  ];

  getContacts(): Contact[] {
    return this.contacts;
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    {
      id: 2,
      name: 'Siti Rahma',
      email: 'siti.rahma@mail.com',
      password: 'secure_password_456',
      role: 'staff',
      created_at: '2026-02-20T10:15:30.000Z',
    },
    {
      id: 3,
      name: 'Andi Wijaya',
      email: 'andi.wijaya@mail.com',
      password: 'sales_secret_789',
      role: 'sales',
      created_at: '2026-03-05T14:22:10.000Z',
    },
  ];

  getUsers(): User[] {
    return this.users;
  }
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private activities: Activities[] = [
    {
      id: 5,
      customer_id: 5,
      type: 'xxx',
      description: 'yyy',
      activity_date: '24-03-2026',
      created_by: 1,
    },
    {
      id: 6,
      customer_id: 6,
      type: 'xxx',
      description: 'yyy',
      activity_date: '24-03-2026',
      created_by: 1,
    },
  ];

  getActivities(): Activities[] {
    return this.activities;
  }
}
