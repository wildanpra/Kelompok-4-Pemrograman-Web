import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../service/user_services';
import { User } from '../../models/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'gagal memuat data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
