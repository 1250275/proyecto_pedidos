import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.verificarSesion().pipe(
    map((conSesion) => {
      if (!conSesion) return router.createUrlTree(['/login']);
      if (!auth.tieneRol(route.data?.['roles'])) return router.createUrlTree(['/inicio']);
      return true;
    }),
  );
};

export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.verificarSesion().pipe(map((conSesion) => (conSesion ? router.createUrlTree(['/inicio']) : true)));
};
