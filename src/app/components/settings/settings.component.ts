import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {}

  logOut(){
    this.auth.logOutUser();
  }
  comeBack(){
    this.router.navigate([''])
  }
}
