import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Ensure this points to the routes we just defined

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
