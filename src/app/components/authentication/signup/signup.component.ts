import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

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
      password: ['', [Validators.required,Validators.maxLength(15), Validators.minLength(6),], []],
      confirmPassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]]
    });

    this.form.valueChanges
      .pipe(debounceTime(500)).subscribe(val => {
        console.log(val);
        this.validatePassword(val);

      });
  }

  /**
   * 
   * @param val 
   * @author fromero
   */

  invalidConfirmation = true;
  validatePassword(val) {
    if (val && (val.password === val.confirmPassword) && (val.password != "" && val.confirmPassword != "")) {

      console.log(val.password, val.confirmPassword, true);
      this.invalidConfirmation = false;
    } else {
      this.invalidConfirmation = true;
    }
  }

  /**
   * login con email y password
   * @author fromero
   */
  onSignIn(): void {
    event.preventDefault();
    this.auth
      .registerUserEmail(this.form.get('email').value, this.form.get('password').value)
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
    this.auth.loginUserGmail()
      .then((res) => {
        console.log(res);
        this.router.navigate(['']);
      })
      .catch((err) => {
        console.log("err", JSON.parse(err));
      });
  }


}
