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

import { UserService } from '../../service/user_service';

import { User } from '../../models/User';


@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.html',
  standalone: true
})

export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild('datatablesSimple') tableRef !: ElementRef;
  user: User[] = [];
  isLoading: boolean = true;
  errorMsg: string =''

  constructor (
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  async ngAfterViewInit(): Promise<void> {
    if(isPlatformBrowser(this.platformId)) {
      const {DataTable} = await import ('simple-datatables');
      const table = this.tableRef?.nativeElement;
    if(table)new DataTable(table);
    }
  }

  loadUser(): void{
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next : (res) =>{
        this.user = res.data;
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