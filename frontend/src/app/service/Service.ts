import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { Contact } from '../models/Contact';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi@mail.com',
      phone: '08123',
      company: 'PT ABC',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Siti Aminah',
      email: 'siti@mail.com',
      phone: '08124',
      company: 'PT XYZ',
      status: 'Inactive',
    },
  ];

  getCustomers(): Customer[] {
    return this.customers;
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
