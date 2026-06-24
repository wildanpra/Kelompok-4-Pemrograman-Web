import { Inject, PLATFORM_ID, Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CustomerService } from '../../service/customer_services';

import { Customer } from '../../models/Customer';

import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('CustomerComponent: Berjalan di BROWSER. Memulai pemuatan data...');
      this.loadCustomers();
    } else {
      console.log('CustomerComponent: Berjalan di SERVER (SSR). Menunda pemuatan data...');
      this.isLoading = false;
    }
  }

  loadCustomers(): void {
    this.isLoading = true;
    console.log('CustomerComponent: Memanggil API Customer...');
    this.customerService.getAll().subscribe({
      next: (res) => {
        console.log(
          'CustomerComponent: API sukses. Jumlah data customer:',
          res.data?.length,
          res.data,
        );
        this.customers = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('CustomerComponent: API gagal dipanggil. Detail error:', err);
        this.errorMessage = 'Gagal memuat data';
        this.isLoading = false;
      },
    });
  }
}
