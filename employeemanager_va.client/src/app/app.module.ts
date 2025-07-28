import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeTable } from './employee-table.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import Lara from '@primeuix/themes/aura';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { EmployeeService } from './employee.service';
import * as $ from "jquery";

@NgModule({
  declarations: [],
  bootstrap: [EmployeeFormComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    IconField,
    InputIconModule,
    EmployeeTable,
    FaIconComponent,
    EmployeeFormComponent
  ],
  providers: [provideHttpClient(withFetch(),
    withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    }),
    EmployeeService
  ]
})
export class AppModule {
//  faCoffee = faCoffee;
}
