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
import { Lead } from '../../models/Lead';
import { Customer } from '../../models/Customer';
import { User } from '../../models/User';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leads.html',
})
export class LeadsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' = 'list';
  leads: Lead[] = [];
  customersList: Customer[] = [];
  usersList: User[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;

  constructor(
    private leadService: LeadService,
    private customerService: CustomerService,
    private userService: UserService,
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
      status: ['new'],
      assigned_to: [''],
    });
  }

  ngOnInit(): void {
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
      status: 'new',
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
        window.location.href = '/leads';
        this.cdr.detectChanges();
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
}
