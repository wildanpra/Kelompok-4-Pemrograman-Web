import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivitiesService } from '../../service/activities_services';
import { Activities } from '../../models/Activities';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.html',
})
export class ActivitiesComponent implements OnInit {
  activities: Activities[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private activitiesService: ActivitiesService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadActivities();
    }
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activitiesService.getAll().subscribe({
      next: (res) => {
        this.activities = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'gagal memuat data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
