import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/customer_services';
import { Customer } from '../../models/Customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer.html',
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.customers = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'gagal memuat data';
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
