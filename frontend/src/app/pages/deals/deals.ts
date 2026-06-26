import {
  Inject,
  PLATFORM_ID,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { DealService } from '../../service/deal_services';
import { LeadService } from '../../service/lead_services';
import { Deal } from '../../models/Deal';
import { Lead } from '../../models/Lead';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deals.html',
})
export class DealsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' = 'list';
  deals: Deal[] = [];
  leadsList: Lead[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;

  constructor(
    private dealService: DealService,
    private leadService: LeadService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      lead_id: ['', Validators.required],
      title: ['', Validators.required],
      value: [''],
      stage: [''],
      closed_at: [''],
      created_at: [1],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDeal();
      this.loadLeads();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadDeal(): void {
    this.isLoading = true;
    console.log('DealComponent: Memanggil API Deal...');
    this.dealService.getAll().subscribe({
      next: (res) => {
        this.deals = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Gagal memuat data';
        this.isLoading = false;
      },
    });
  }

  loadLeads(): void {
    this.leadService.getAll().subscribe({
      next: (res) => {
        this.leadsList = res.data;
        if (this.leadsList.length && !this.createForm.get('lead_id')?.value) {
          this.createForm.patchValue({ lead_id: this.leadsList[0].id });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showCreate(): void {
    this.createForm.reset({
      lead_id: this.leadsList.length ? this.leadsList[0].id : '',
      stage: 'Proposal',
      created_at: 1
    });
    this.errorMsg = '';
    this.successMsg = '';
    this.view = 'create';
  }

  submitCreate(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.createForm.invalid) {
      this.errorMsg = 'Mohon lengkapi form dengan benar.';
      return;
    }

    const rawValue = this.createForm.value;
    const payload = Object.keys(rawValue).reduce((acc, key) => {
      acc[key] = rawValue[key] === '' ? null : rawValue[key];
      return acc;
    }, {} as any);

    this.isSaving = true;
    this.errorMsg = '';

    this.dealService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Berhasil',
          text: 'Deal berhasil ditambahkan',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/deals';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan Deal.';
        console.error(err);
      },
    });
  }

  backToList(): void {
    this.view = 'list';
    this.errorMsg = '';
    this.successMsg = '';
    this.needsTableInit = true;
  }
}
