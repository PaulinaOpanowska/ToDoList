import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import { AuthenticationService } from '../services/auth/authentication.service';
import { AuthGuard } from '../guards';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from '../services/auth/auth-guard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthModule } from '../services/auth';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../common-services/config.service';
import { ToDoService } from '../services/to-do.service';
import { PaginationComponent } from './shared/pagination.component';
import { FormComponent } from './form/form.component';
import { ToastyModule } from 'ng2-toasty';
import { AppErrorHandler } from './app.error-handler';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'form/new', component: FormComponent, canActivate: [ AuthGuardService ] },
  { path: 'form/edit/:id', component: FormComponent, canActivate: [ AuthGuardService ] },
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '404', component: NotFoundComponent, canActivate: [AuthGuardService]},
  {path: '**', component: NotFoundComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    PaginationComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AuthModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpModule,
    HttpClientJsonpModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  }),
  ],
  exports: [TranslateModule],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AuthGuard,AuthenticationService, ConfigService, ToDoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
