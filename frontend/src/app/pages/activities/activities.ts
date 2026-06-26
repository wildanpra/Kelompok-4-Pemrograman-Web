import {
  Inject,
  PLATFORM_ID,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { ActivitiesService } from '../../service/activities_services';
import { CustomerService } from '../../service/customer_services';
import { Customer } from '../../models/Customer';
import { Activities } from '../../models/Activities';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth_service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activities.html',
})
export class ActivitiesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' | 'edit' = 'list';
  activities: Activities[] = [];
  customer: Customer[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  editForm: FormGroup;
  selectedActivityId: number | null = null;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;
  isAdmin: boolean = false;

  // 1. TAMBAHAN DI SINI: Fungsi pembantu untuk membuat format string tanggal jam sekarang (HTML5 local)
  getTodayDateTimeString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Hasil: "2026-06-24T16:15"
  }

  constructor(
    private ActivitiesService: ActivitiesService,
    private CustomerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      customer_id: ['', Validators.required],
      type: [''],
      description: [''],
      // 2. TAMBAHAN DI SINI: Ganti nilai awal String kosong menjadi fungsi getTodayDateTimeString()
      activity_date: [this.getTodayDateTimeString(), Validators.required],
      created_by: ['1'],
    });
    this.editForm = this.fb.group({
      customer_id: ['', Validators.required],
      type: [''],
      description: [''],
      activity_date: [this.getTodayDateTimeString(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (isPlatformBrowser(this.platformId)) {
      this.loadActivities();
      this.loadCustomers();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadActivities(): void {
    this.isLoading = true;
    console.log('Activities Component: Memanggil API Activities...');
    this.ActivitiesService.getAll().subscribe({
      next: (res) => {
        this.activities = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Gagal memuat data';
        this.isLoading = false;
      },
    });
  }

  loadCustomers(): void {
    this.CustomerService.getAll().subscribe({
      next: (res) => {
        this.customer = res.data;
        if (this.customer.length && !this.createForm.get('customer_id')?.value) {
          this.createForm.patchValue({ customer_id: this.customer[0].id });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showCreate(): void {
    const defaultCustId = this.customer.length ? this.customer[0].id : '';
    this.createForm.reset({
      customer_id: defaultCustId,
      type: 'Call',
      description: '',
      activity_date: this.getTodayDateTimeString(),
      created_by: 1,
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

    this.ActivitiesService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Berhasil',
          text: 'Activity berhasil ditambahkan',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/activities';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        const backendErrors = err.error?.errors;
        this.errorMsg = Array.isArray(backendErrors)
          ? backendErrors.join(', ')
          : (err.error?.message || 'Gagal menambahkan activities.');
        this.cdr.detectChanges();
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

  formatDateTimeLocal(dateInput: any): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  showEditById(id: number | undefined): void {
    const activity = this.activities.find((a) => a.id === id);
    if (!activity) {
      this.errorMsg = 'Data activity tidak ditemukan';
      return;
    }
    this.selectedActivityId = activity.id!;
    this.editForm.reset();
    
    const formattedDate = this.formatDateTimeLocal(activity.activity_date);
    
    this.editForm.patchValue({
      customer_id: activity.customer_id,
      type: activity.type,
      description: activity.description,
      activity_date: formattedDate
    });

    this.errorMsg = '';
    this.successMsg = '';
    this.view = 'edit';
  }

  submitUpdate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.editForm.invalid || !this.selectedActivityId) {
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
    this.ActivitiesService.update(this.selectedActivityId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Success',
          text: 'Activity berhasil diupdate',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/activities';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        const backendErrors = err.error?.errors;
        this.errorMsg = Array.isArray(backendErrors)
          ? backendErrors.join(', ')
          : (err.error?.message || 'Gagal memperbarui activities');
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  deleteActivity(id: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus activity ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ActivitiesService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Activity berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = '/activities';
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMsg = err.error?.message || 'Gagal menghapus activity';
            console.error(err);
          },
        });
      }
    });
  }
}
