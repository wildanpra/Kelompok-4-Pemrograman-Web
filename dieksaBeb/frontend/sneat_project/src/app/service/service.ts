import { inject, Injectable } from "@angular/core";
import { Customer } from "../models/Customer";

@Injectable({providedIn: 'root'})

export class CustomerService {
    private customers: Customer[] = [
        {
            id: 1,
            name: "Budi Santoso",
            email: "budi@santoso.com",
            phone: "0812345678",
            company: "PT Lampung",
            status: "Active",
            created_by: 1,
            created_at: "12-01-2024"
        },
        {
            id: 2,
            name: "Radhika",
            email: "radhika@santoso.com",
            phone: "0812345678",
            company: "PT Lampung",
            status: "Active",
            created_by: 1,
            created_at: "12-01-2026"
        }
    ];
    getCustomers(): Customer[]{
        return this.customers;
    }
}