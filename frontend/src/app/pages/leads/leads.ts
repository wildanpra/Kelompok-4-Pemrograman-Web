import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LeadService } from '../../service/lead.service';
import { Lead } from '../../models/Lead';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads.html',
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private leadService: LeadService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeads();
    }
  }

  loadLeads(): void {
    this.isLoading = true;
    this.leadService.getAll().subscribe({
      next: (res) => {
        this.leads = res.data;
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
