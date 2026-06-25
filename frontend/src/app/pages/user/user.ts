import {
  Inject,
  PLATFORM_ID,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { UserService } from '../../service/user_services';
import { User } from '../../models/User';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.html',
})
export class UserComponent implements OnInit, AfterViewInit, AfterViewChecked {
  view: 'list' | 'create' = 'list';
  users: User[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  needsTableInit: boolean = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      password: [''],
      role: [''],
      created_at: [1],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUser();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}

  loadUser(): void {
    this.isLoading = true;
    console.log('UserComponent: Memanggil API User...');
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res.data;
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
    this.createForm.reset({ role: 'user' });
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

    this.userService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        window.location.href = '/user';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || 'Gagal menambahkan users.';
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
