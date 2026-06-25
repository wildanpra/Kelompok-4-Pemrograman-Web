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

import { ContactService } from '../../service/contact_service';

import { Contact } from '../../models/Contact';


@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  standalone: true
})

export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('datatablesSimple') tableRef !: ElementRef;
  contact: Contact[] = [];
  isLoading: boolean = true;
  errorMsg: string =''

  constructor (
    private contactService: ContactService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadContact();
  }

  async ngAfterViewInit(): Promise<void> {
    if(isPlatformBrowser(this.platformId)) {
      const {DataTable} = await import ('simple-datatables');
      const table = this.tableRef?.nativeElement;
    if(table)new DataTable(table);
    }
  }

  loadContact(): void{
    this.isLoading = true;
    this.contactService.getAll().subscribe({
      next : (res) =>{
        this.contact = res.data;
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