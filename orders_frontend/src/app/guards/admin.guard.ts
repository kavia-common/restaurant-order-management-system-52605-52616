import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.state$.pipe(
    map((s) => {
      if (s.loading) return false;
      if (s.user && s.role === 'admin') return true;
      router.navigateByUrl('/menu');
      return false;
    }),
  );
};
