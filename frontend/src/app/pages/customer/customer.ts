import { Inject, PLATFORM_ID, AfterViewInit, Component, OnInit } from '@angular/core';
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

  // constructor(private customerService: CustomerService) {}

  constructor(
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // async ngAfterViewInit(): Promise<void> {
  //   if (isPlatformBrowser(this.platformId)) {
  //     // const { DataTable } = await import('simple-datatables');
  //     // const table = this.tableRef?.nativeElement;
  //     // if (table) new DataTable(table);
  //   }
  // }

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
      },
    });
  }
}
