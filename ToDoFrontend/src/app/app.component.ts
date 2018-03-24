import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../common-services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  returnUrl: any;
  loginUser: string;

  constructor(private translate: TranslateService, private authService: AuthenticationService,private route: ActivatedRoute, private router: Router, private conf: ConfigService) 
  {
    translate.addLangs(['EN', 'PL']);
    translate.setDefaultLang('EN');
  }

  public ngOnInit()
  {
  }

  wyloguj()
  {
    this.authService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    this.router.navigate([this.returnUrl]);
  }

  changeLang(lng) 
  {
    this.translate.use(lng);
  }

  loggedIn() 
  {
    return this.authService.loggedIn();
  }
}
