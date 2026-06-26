import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth_service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Cek password & confirmPassword harus sama
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.invalid) {
      const msg = this.registerForm.errors?.['passwordMismatch']
        ? 'Password tidak cocok'
        : 'Lengkapi semua field dengan benar';
      Swal.fire('Error', msg, 'error');
      return;
    }

    const { name, email, password } = this.registerForm.value;

    // role di-set otomatis 'staff' (tidak dipilih user)
    const payload = {
      name: name.trim(),
      email,
      password,
      role: 'staff'
    };

    this.auth.register(payload).subscribe({
      next: () => {
        Swal.fire({
          title: 'Berhasil',
          text: 'Registrasi sukses! Silakan login.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Registrasi gagal, coba lagi';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
}
