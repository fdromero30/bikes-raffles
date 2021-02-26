import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  user: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) {
    this.buildForm();
  }

  ngOnInit() { }

  /**
   * 
   */
  comeBack() {
    this.router.navigate(['authentication']);
  }

  /**
     * 
     */
  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(10), Validators.email]],
      password: ['', [Validators.required], []]
    });

    this.form.valueChanges
      .pipe(debounceTime(500)).subscribe(val => {
        console.log(val);
      });
  }

  /**
   * login con email y password
   * @author fromero
   */
  onLogin(): void {
    event.preventDefault();
    this.auth
      .loginUserEmail(this.form.get('email').value, this.form.get('password').value)
      .then((res) => {
        this.auth.authenticated = true;
        console.log(res, "succesfylly login!");
        this.router.navigate(['']);
      });
  }


  /**
   * @author fromero
   * autenticación con google
   */
  onLoginGoogle(): void {
    this.auth
      .loginUserGmail()
      .then((res) => {
        console.log(res);
        this.router.navigate(['']);
      })
      .catch((err) => {
        console.log("err", JSON.parse(err));
      });
  }

}
