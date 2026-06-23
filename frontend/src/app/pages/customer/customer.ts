import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/Service';
import { Customer } from '../../models/Customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer.html'
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customers = this.customerService.getCustomers();
  }
}
