import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Stripe } from '@ionic-native/stripe/ngx';
import { MatchService } from './services/match.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { AuthGuardService } from './services/guard.service';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@NgModule({
  declarations: [
      AppComponent
    , AuthenticationComponent
    , LoginComponent
    , SignupComponent],
  entryComponents: [],
  imports: [BrowserModule
    , IonicModule.forRoot()
    , AppRoutingModule
    , HttpClientModule
    , ReactiveFormsModule
    , AngularFireModule.initializeApp(environment.firebaseConfig)
    , AngularFireAuthModule,],
  providers: [
    StatusBar,
    SplashScreen, 
    Stripe, 
    MatchService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClient, 
    UserService, 
    AuthGuardService, 
    AuthService,   
    GooglePlus,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
