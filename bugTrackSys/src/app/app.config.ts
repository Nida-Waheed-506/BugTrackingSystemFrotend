import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import this
import { provideToastr } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { CredentialsInterceptor } from './services/Interceptor/credentials-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
    }),
    importProvidersFrom(MatDialogModule),
  ],
};
