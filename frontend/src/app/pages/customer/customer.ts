import {
  Inject,
  PLATFORM_ID,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
  NgZone,
} from '@angular/core';
import { CustomerService } from '../../service/customer_services';
import { Customer } from '../../models/Customer';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth_service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.html',
})
export class CustomerComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' | 'edit' = 'list';
  customers: Customer[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;
  editForm: FormGroup;
  selectedCustomerId: number | null = null;
  isAdmin: boolean = false;
  isSales: boolean = false;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      company: [''],
      status: ['Active'],
      created_by: [1],
    });
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      company: [''],
      status: ['Active'],
      // created_by: [1],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isSales = this.authService.getUserRole() === 'sales';
    if (isPlatformBrowser(this.platformId)) {
      this.loadCustomers();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadCustomers(): void {
    this.isLoading = true;
    console.log('CustomerComponent: Memanggil API Customer...');
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.customers = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Gagal memuat data';
        this.isLoading = false;
      },
    });
  }

  showCreate(): void {
    this.createForm.reset({ status: 'Active', created_by: 1 });
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

    this.customerService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Berhasil',
          text: 'Customer berhasil ditambahkan',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/customers';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan customer.';
        console.error(err);
      },
    });
  }

  // Ambil dari data lokal berdasarkan id -> dijamin sesuai baris yang diklik
  showEditById(id: number | undefined): void {
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) {
      this.errorMsg = 'Data customer tidak ditemukan';
      return;
    }
    this.selectedCustomerId = customer.id!;
    this.editForm.reset();
    this.editForm.patchValue(customer);
    this.errorMsg = '';
    this.successMsg = '';
    this.view = 'edit';
  }

  submitUpdate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.editForm.invalid || !this.selectedCustomerId) {
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
    this.customerService.update(this.selectedCustomerId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Success',
          text: 'Customer berhasil diupdate',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/customers';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal memperbarui customers';
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

  deleteCustomer(id: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus customer ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Customer berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = '/customers';
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMsg = err.error?.message || 'Gagal menghapus customer';
            console.error(err);
          },
        });
      }
    });
  }
}
