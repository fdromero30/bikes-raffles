import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {

  constructor(private router: Router) { }

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  ngOnInit() { }

  goToSignIn() {
    this.router.navigate(['/authentication/signup']);
  }

  goToLogin() {
    this.router.navigate(['/authentication/login']);
  }

}
