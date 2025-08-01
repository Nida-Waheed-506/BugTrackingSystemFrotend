import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Data } from './services/data';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const data = inject(Data);
  const router = inject(Router);

  return data.checkAuth().pipe(
    map((res: any) => {
      
      data.loggedInUserInfo$.next(res.data);
      return true;
    }),
    catchError((err) => {
      data.loggedInUserInfo$.next(null);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
