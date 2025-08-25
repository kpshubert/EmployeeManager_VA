import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { OverlayModule } from '@angular/cdk/overlay'; import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import Lara from '@primeuix/themes/aura';
import * as $ from "jquery";
import { AppComponent } from './Views/app/app.component';
import { LoadingDataComponent } from '..//../src/app/Shared/Modules/loading-data/loading-data.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    AppComponent,
    NgbModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressBarModule,
    OverlayModule
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
  ],
  declarations: [
    LoadingDataComponent
  ]
})
export class AppModule {
}
