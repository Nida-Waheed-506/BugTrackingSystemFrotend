import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Data } from './services/data';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const data = inject(Data);
  const router = inject(Router);

  return data.loggedInUserInfo$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
