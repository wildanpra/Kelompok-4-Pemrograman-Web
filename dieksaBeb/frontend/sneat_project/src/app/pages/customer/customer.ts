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

import { CustomerService } from '../../service/service';

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

  constructor (
    private CustomerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.customers = this.CustomerService.getCustomers();
  }

  async ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)) {
      const {DataTable} = await import ('simple-datatables');
      const table = this.tableRef.nativeElement;
    if(table){
      new DataTable(table);
    }
  }
}
}
