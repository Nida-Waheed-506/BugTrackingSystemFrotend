import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from './services/user/user';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const user_service = inject(User);
  const router = inject(Router);

  return user_service.checkAuth().pipe(
    map((res: any) => {
      user_service.loggedInUserInfo$.next(res.data);
      return true;
    }),
    catchError((err) => {
      user_service.loggedInUserInfo$.next(null);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
