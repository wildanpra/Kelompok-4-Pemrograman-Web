import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../service/lead_services';
import { CustomerService } from '../../service/customer_services';
import { UserService } from '../../service/user_services';
import { AuthService } from '../../service/auth_service';
import { Lead } from '../../models/Lead';
import { Customer } from '../../models/Customer';
import { User } from '../../models/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leads.html',
})
export class LeadsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' | 'edit' = 'list';
  leads: Lead[] = [];
  customersList: Customer[] = [];
  usersList: User[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  editForm: FormGroup;
  selectedLeadId: number | null = null;
  isAdmin: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;
  selectedStatus: string = '';

  constructor(
    private leadService: LeadService,
    private customerService: CustomerService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      customer_id: ['', Validators.required],
      title: ['', Validators.required],
      source: [''],
      notes: [''],
      status: ['New'],
      assigned_to: [''],
    });

    this.editForm = this.fb.group({
      customer_id: ['', Validators.required],
      title: ['', Validators.required],
      source: [''],
      notes: [''],
      status: ['New'],
      assigned_to: [''],
      deal_value: [null],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeads();
      this.loadCustomers();
      this.loadUsers();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadLeads(): void {
    this.isLoading = true;
    this.leadService.getAll().subscribe({
      next: (res) => {
        this.leads = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Gagal memuat data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.customersList = res.data;
        if (this.customersList.length && !this.createForm.get('customer_id')?.value) {
          this.createForm.patchValue({ customer_id: this.customersList[0].id });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.usersList = res.data;
        if (this.usersList.length && !this.createForm.get('assigned_to')?.value) {
          this.createForm.patchValue({ assigned_to: this.usersList[0].id });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showCreate(): void {
    this.createForm.reset({
      customer_id: this.customersList.length ? this.customersList[0].id : '',
      status: 'New',
      assigned_to: this.usersList.length ? this.usersList[0].id : ''
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

    this.leadService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Berhasil',
          text: 'Lead berhasil ditambahkan',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/leads';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan lead.';
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

  showEditById(id: number | undefined): void {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) {
      this.errorMsg = 'Data lead tidak ditemukan';
      return;
    }
    this.selectedLeadId = lead.id!;
    this.editForm.reset();
    this.editForm.patchValue({
      customer_id: lead.customer_id,
      title: lead.title,
      source: lead.source,
      notes: lead.notes,
      status: lead.status,
      assigned_to: lead.assigned_to,
      deal_value: lead.deal_value ?? null,
    });
    this.errorMsg = '';
    this.successMsg = '';
    this.view = 'edit';
  }

  submitUpdate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.editForm.invalid || !this.selectedLeadId) {
      this.errorMsg = 'Mohon lengkapi form dengan benar';
      return;
    }
    const rawValue = this.editForm.value;
    const payload = Object.keys(rawValue).reduce((acc, key) => {
      acc[key] = rawValue[key] === '' ? null : rawValue[key];
      return acc;
    }, {} as any);
    this.isSaving = true;
    this.errorMsg = '';
    this.leadService.update(this.selectedLeadId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Success',
          text: 'Lead berhasil diupdate',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/leads';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal memperbarui lead';
        console.error(err);
      },
    });
  }

  deleteLead(id: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus lead ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan',
    }).then((result) => {
      if (result.isConfirmed) {
        this.leadService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Lead berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = '/leads';
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMsg = err.error?.message || 'Gagal menghapus lead';
            console.error(err);
          },
        });
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.cdr.detectChanges();
  }

  getFilteredLeads(): Lead[] {
    if (!this.selectedStatus) {
      return this.leads;
    }
    return this.leads.filter(
      (l) => (l.status || '').toLowerCase() === this.selectedStatus.toLowerCase()
    );
  }
}
