import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DealService } from '../../service/deal_services';
import { Deal } from '../../models/Deal';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals.html',
})
export class DealsComponent implements OnInit {
  deals: Deal[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDeals();
    }
  }

  loadDeals(): void {
    this.isLoading = true;
    this.dealService.getAll().subscribe({
      next: (res) => {
        this.deals = res.data;
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
