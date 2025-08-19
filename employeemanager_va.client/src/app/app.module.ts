import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeFormComponent } from './Views/EmployeeForm/employee-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/aura';
import * as $ from "jquery";

@NgModule({
  bootstrap: [EmployeeFormComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [provideHttpClient(withFetch(),
    withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
})
export class AppModule {
}
