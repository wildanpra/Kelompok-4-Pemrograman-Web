import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth_service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const auth = inject(AuthService);

  // Saat SSR (server) localStorage tidak ada -> biarkan render lewat
  if (!isPlatformBrowser(platformId)) return true;

  if (auth.isLoggedIn()) return true;

  // Belum login redirect langsung ke /login (tanpa returnUrl)
  return router.createUrlTree(['/login']);
};
