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

import { ActivitiesService } from '../../service/activities_service';

import { Activities } from '../../models/Activities';


@Component({
  selector: 'app-activities',
  imports: [CommonModule],
  templateUrl: './activities.html',
  standalone: true
})

export class ActivitiesComponent implements OnInit, AfterViewInit {
  @ViewChild('datatablesSimple') tableRef !: ElementRef;
  activities: Activities[] = [];
  isLoading: boolean = true;
  errorMsg: string =''

  constructor (
    private activitiesService: ActivitiesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  async ngAfterViewInit(): Promise<void> {
    if(isPlatformBrowser(this.platformId)) {
      const {DataTable} = await import ('simple-datatables');
      const table = this.tableRef?.nativeElement;
    if(table)new DataTable(table);
    }
  }

  loadActivities(): void{
    this.isLoading = true;
    this.activitiesService.getAll().subscribe({
      next : (res) =>{
        this.activities = res.data;
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


