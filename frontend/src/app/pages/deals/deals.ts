import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService } from '../../service/deal_services';
import { Deal } from '../../models/Deal';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsComponent implements OnInit {
  deals: Deal[] = [];
  filteredDeals: Deal[] = [];
  isLoading = false;
  errorMsg = '';
  selectedStage = '';

  readonly stages = ['Proposal', 'Negotiation', 'Won', 'Lost'];

  readonly stageBadge: Record<string, string> = {
    'Proposal': 'bg-primary',
    'Negotiation': 'bg-warning text-dark',
    'Won': 'bg-success',
    'Lost': 'bg-danger',
  };

  readonly stageHeader: Record<string, string> = {
    'Proposal': 'bg-primary text-white',
    'Negotiation': 'bg-warning text-dark',
    'Won': 'bg-success text-white',
    'Lost': 'bg-danger text-white',
  };

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.isLoading = true;
    this.dealService.getAll().subscribe({
      next: (res) => {
        this.deals = res.data.map((d: Deal) => ({
          ...d,
          value: typeof d.value === 'number' ? d.value : parseFloat(String(d.value || 0))
        }));
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Gagal memuat data deals';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    this.filteredDeals = this.selectedStage
      ? this.deals.filter(d => d.stage === this.selectedStage)
      : [...this.deals];

    // 4. Update UI jika filter berubah
    this.cdr.markForCheck();
  }

  filterByStage(stage: string): void {
    this.selectedStage = stage;
    this.applyFilter();
  }

  // — Helpers —
  getDealsByStage(stage: string): Deal[] {
    return this.filteredDeals.filter(d => d.stage === stage);
  }

  getTotalByStage(stage: string): number {
    return this.getDealsByStage(stage).reduce((sum, d) => sum + (d.value || 0), 0);
  }

  getBadgeClass(stage: string): string { return this.stageBadge[stage] ?? 'bg-secondary'; }
  getHeaderClass(stage: string): string { return this.stageHeader[stage] ?? 'bg-secondary text-white'; }
}
