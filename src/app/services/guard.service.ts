import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public router: Router, private auth: AuthService) { }
    canActivate(): boolean {

        const au = this.auth.isAuthenticated();
        if (!au) {
            this.router.navigate(['authentication']);
            console.log(false);
            return false;
        }
        console.log(true);
        return true;
    }
}