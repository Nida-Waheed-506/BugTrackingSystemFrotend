import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Service } from './services/service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(Service);
  const router = inject(Router);

  return service.checkAuth().pipe(
    map((res: any) => {
      
      service.loggedInUserInfo$.next(res.data);
      return true;
    }),
    catchError((err) => {
      service.loggedInUserInfo$.next(null);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
