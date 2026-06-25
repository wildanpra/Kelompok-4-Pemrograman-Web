import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../service/auth_service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {}
  onLogout(): void {
    Swal.fire({
      title: 'Logout?',
      text: 'Anda akan keluar dari aplikasi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.auth.logout();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil Logout',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        this.ngZone.run(() => this.router.navigate(['/login']));
      });
    });
  }
}
