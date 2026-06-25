import {  
  Component,       
  AfterViewInit,       
  ElementRef,      
  ViewChild,    
  OnInit,     
  PLATFORM_ID,     
  Inject
} from '@angular/core';

import {
  isPlatformBrowser,
  CommonModule
} from '@angular/common';

import { CustomerService } from '../../service/customer_service';

import { Customer } from '../../models/Customer';


@Component({
  selector: 'app-customer',
  imports: [CommonModule],
  templateUrl: './customer.html',
  // styleUrl: './customer.css',
  standalone: true
})

export class CustomerComponent implements OnInit, AfterViewInit {
  @ViewChild('datatablesSimple') tableRef !: ElementRef;
  customers: Customer[] = [];
  isLoading: boolean = true;
  errorMsg: string =''

  constructor (
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  async ngAfterViewInit(): Promise<void> {
    if(isPlatformBrowser(this.platformId)) {
      const {DataTable} = await import ('simple-datatables');
      const table = this.tableRef?.nativeElement;
    if(table)new DataTable(table);
    }
  }

  loadCustomers(): void{
    this.isLoading = true;
    this.customerService.getAll().subscribe({
      next : (res) =>{
        this.customers = res.data;
        this.isLoading = false;
      },
      error: (err)=>{
        this.errorMsg = "Gagal memuat data";
        this.isLoading = false;
        console.log(err);
      }
    });
  }
}

