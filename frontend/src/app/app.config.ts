import { bearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { errorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([bearerTokenInterceptor,errorHandlerInterceptor])),
    provideAnimationsAsync(),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      progressBar: true,
      closeButton: true,
      timeOut: 3000,
      enableHtml: true,
      titleClass: 'd-none',
      messageClass: 'text-white',
      disableTimeOut: false,
      extendedTimeOut: 1000,
      preventDuplicates: true,
    }), provideAnimationsAsync(),
  ],
};
