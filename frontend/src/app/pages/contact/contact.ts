import {
  Inject,
  PLATFORM_ID,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { ContactService } from '../../service/contact_services';
import { CustomerService } from '../../service/customer_services';
import { Contact } from '../../models/Contact';
import { Customer } from '../../models/Customer';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
})
export class ContactComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' = 'list';
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

  constructor(
    private contactService: ContactService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
  }

  ngOnInit(): void {
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
      created_by: 1
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
        window.location.href = '/contact';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan contact.';
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
