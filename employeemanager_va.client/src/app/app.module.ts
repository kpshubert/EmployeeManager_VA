import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import Lara from '@primeuix/themes/aura';
import * as $ from "jquery";
import { AppComponent } from './Views/app/app.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    AppComponent,
    NgbModule
  ],
  providers: [provideHttpClient(withFetch(),
    withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    }),
    provideRouter(routes)
  ]
})
export class AppModule {
}
