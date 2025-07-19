import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import * as $ from "jquery";

@NgModule({ declarations: [
        AppComponent
    ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi())],
})
export class AppModule {
  faCoffee = faCoffee;
  reactiveFormsModule = ReactiveFormsModule;
  $ = $;
}
