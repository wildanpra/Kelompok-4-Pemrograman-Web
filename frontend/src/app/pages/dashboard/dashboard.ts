import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../service/dashboard_service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats: any = null;
  isLoading: boolean = true;
  errorMsg: string = '';
  leadsChart: Chart | null = null;
  dealsChart: Chart | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef, // <- tambah
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.stats = res?.data ?? res ?? null;
        this.isLoading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.createLeadsChart();
          this.createDealsChart();
        }, 0);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Gagal memuat data dashboard.';
        this.isLoading = false;
        this.cdr.detectChanges(); // // paksa re-render
        console.error(err);
      },
    });
  }

  createLeadsChart(): void {
    if (!this.stats?.leads_by_status) return;

    if (this.leadsChart) {
      this.leadsChart.destroy();
    }

    const labels = this.stats.leads_by_status.map((item: any) => item.status);
    const data = this.stats.leads_by_status.map((item: any) => item.total);

    this.leadsChart = new Chart('leadsStatusChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  createDealsChart(): void {
    if (!this.stats?.deals_by_stage) return;

    if (this.dealsChart) {
      this.dealsChart.destroy();
    }

    const labels = this.stats.deals_by_stage.map((item: any) => item.stage);
    const data = this.stats.deals_by_stage.map((item: any) => item.total);

    this.dealsChart = new Chart('dealsStatusChart', {
      type: 'bar',

      data: {
        labels,
        datasets: [
          {
            label: 'Total Deals',
            data,
            backgroundColor: '#198754',
          },
        ],
      },

      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }
}
