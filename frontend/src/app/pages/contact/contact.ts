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
import { ContactService } from '../../service/contact_services';
import { CustomerService } from '../../service/customer_services';
import { Contact } from '../../models/Contact';
import { Customer } from '../../models/Customer';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth_service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
})
export class ContactComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' | 'edit' = 'list';
  contacts: Contact[] = [];
  customersList: Customer[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;
  editForm: FormGroup;
  selectedContactId: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private contactService: ContactService,
    private customerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      customer_id: ['', Validators.required],
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      position: [''],
      created_by: [1],
    });
    this.editForm = this.fb.group({
      customer_id: ['', Validators.required],
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      position: [''],
      //created_by: [1],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (isPlatformBrowser(this.platformId)) {
      this.loadContact();
      this.loadCustomers();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadContact(): void {
    this.isLoading = true;
    console.log('ContactComponent: Memanggil API Contact...');
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contacts = res.data;
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

  showCreate(): void {
    this.createForm.reset({
      customer_id: this.customersList.length ? this.customersList[0].id : '',
      position: '',
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

    this.contactService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Berhasil',
          text: 'Contact berhasil ditambahkan',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/contact';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan contact.';
        console.error(err);
      },
    });
  }

  // Ambil dari data lokal berdasarkan id -> dijamin sesuai baris yang diklik
  showEditById(id: number | undefined): void {
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) {
      this.errorMsg = 'Data contact tidak ditemukan';
      return;
    }
    this.selectedContactId = contact.id!;
    this.editForm.reset();
    this.editForm.patchValue(contact);
    this.errorMsg = '';
    this.successMsg = '';
    this.view = 'edit';
  }

  submitUpdate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.editForm.invalid || !this.selectedContactId) {
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
    this.contactService.update(this.selectedContactId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          title: 'Success',
          text: 'Contact berhasil diupdate',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/contact';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal memperbarui contact';
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

  deleteContact(id: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus contact ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Contact berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = '/contact';
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMsg = err.error?.message || 'Gagal menghapus contact';
            console.error(err);
          },
        });
      }
    });
  }
}
