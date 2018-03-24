import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ConfigService } from '../../common-services/config.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  isSubmitted: boolean = false;
  model: any = {};
  loading = false;
  err = false;
  token:string;
  register: FormGroup;


  constructor(private frmBuilder: FormBuilder, 
    private translate: TranslateService, 
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute, 
    private router: Router, 
    private config: ConfigService) 
  {
    this.token=this.authenticationService.pobierzToken();

    this.register = this.frmBuilder.group({
      username:["", [Validators.required]],
      password:["", [Validators.required]]
    });
  }

  ngOnInit() {
    // get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  get username() { return this.register.get('username'); }
  get password() { return this.register.get('password'); }

  login() {
    this.isSubmitted = true;
    if(!this.register.valid)
    return;
        this.loading = true;
        this.authenticationService.login(this.register.value.username, this.register.value.password).then(
          result => {
              this.loading = true;
              this.err = false;

              this.router.navigate([this.returnUrl]);
          },
          error => {
              this.loading = false;
              this.err = true;
          }
      );
    }

  }