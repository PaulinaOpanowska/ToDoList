import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private auth: AuthenticationService, private router: Router) {

    }

    canActivate() {
        // If user is not logged in we'll send them to the homepage 

        if (this.auth.pobierzToken() == "") {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    };


}
