import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Platform } from '@ionic/angular';
import * as firebase from "firebase";
const { Storage } = Plugins;

export class FirebaseErrorconstants {
    static WRONG_PASSWORD = "auth/wrong-password";
    static EXIST_DIFFERENT_CREDENTIALS =
        "auth/account-exists-with-different-credential";
    static EMAIL_ALREADY_USE = "auth/email-already-in-use";
    static USER_NOT_FOUND = "auth/user-not-found";
}


@Injectable()
export class AuthService {

    authenticated = false;
    email: any;
    user: any;
    supportedPopupSignInMethods = [
        firebase.default.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.default.auth.FacebookAuthProvider.PROVIDER_ID,
    ];

    constructor(private afsAuth: AngularFireAuth, private router: Router, private googlePlus: GooglePlus,
        private platform: Platform,) {
        Storage.get({ key: 'user' }).then(user => {
            this.user = user;
            this.authenticated = true;
        })
    }

    // ...
    isAuthenticated() {
        // Check whether the token is expired and return
        // true or false
        return this.authenticated;
    }

    /**
   * registro con email de usuario
   * @author fromero
   */
    registerUserEmail(email: string, pass: string) {
        this.email = email;
        return new Promise((resolve, reject) => {
            this.afsAuth.createUserWithEmailAndPassword(email, pass).then(
                (userData) => {
                    this.user = userData;
                    this.saveUserStorage();
                    resolve(userData);
                },
                (err) => reject(this.signInWithCredential(err))
            );
        });
    }

    /**
     * login con email
     * @author fromero
     */
    loginUserEmail(email: string, password: string) {
        this.email = email;
        return new Promise((resolve, reject) => {
            this.afsAuth.signInWithEmailAndPassword(email, password).then(
                (userData) => {
                    this.user = userData;
                    this.saveUserStorage();
                    resolve(userData);
                },
                (err) => reject(this.signInWithCredential(err))
            );
        });
    }

    /**
     * login en aplicacion con GOOGLE
     * @author fromero
     */
    loginUserGmail() {
        if (this.platform.is("cordova")) {
            return this.loginGoogleMobile();
        } else {
            return this.loginGoogleWeb();
        }
    }

    /**
   * implmenetacion de login para google en version web
   */
    loginGoogleWeb() {
        return new Promise((resolve, reject) => {
            this.afsAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then(
                (userData) => {
                    this.user = userData;
                    this.saveUserStorage();
                    resolve(userData);
                },
                (err) => reject(this.signInWithCredential(err))
            );
        });
    }

    /**
   * handler para validacion de mixed multiple accounts
   * @param err
   */
    async signInWithCredential(err) {

        debugger;
        if (
            err.email &&
            err.credential &&
            err.code === FirebaseErrorconstants.EXIST_DIFFERENT_CREDENTIALS
        ) {
            let providers = null;
            this.afsAuth.fetchSignInMethodsForEmail(err.email).then((res) => {
                providers = res;
                const firstPopupProviderMethod = providers.find((p: any) =>
                    this.supportedPopupSignInMethods.includes(p)
                );
                if (!firstPopupProviderMethod) {
                    throw new Error(
                        `Your account is linked to a provider that isn't supported.`
                    );
                }
                const linkedProvider = this.getProvider(firstPopupProviderMethod);
                linkedProvider.setCustomParameters({ login_hint: err.email });
                let result = null;
                if (
                    firstPopupProviderMethod === "google.com" &&
                    !this.platform.is("desktop")
                ) {
                    this.loginGoogleMobile().then((res: any) => {
                        res.linkWithCredential(err.credential);
                        this.saveUserStorage();
                        this.router.navigate(['']);
                    });
                } else {
                    this.afsAuth.signInWithPopup(linkedProvider).then((res) => {
                        result = res;
                        result.user.linkWithCredential(err.credential);
                        this.user = result.user;
                        this.saveUserStorage();
                        this.router.navigate(['']);
                    });
                }
            });
        } else {
            this.handlerErrorAuth(err);
        }
    }


    /**
     *
     * @param err
     */
    handlerErrorAuth(err) {
        console.log(err);
    }

    /**
     * log Out aplicacion
     */

    logOutUser() {
        this.authenticated = false;
        this.router.navigate(['authentication/login']);
        Storage.clear();
        this.afsAuth.signOut();
        this.user = null;

    }

    /**
     * valida si el usuario  està logueado
     * @author fromero
     */
    isAuth() {
        return this.afsAuth.authState.pipe(map((auth) => auth));
    }
    /**
 *
 */
    saveUserStorage() {
        this.authenticated = true;
        Storage.set({ key: "user", value: JSON.stringify(this.user) });
        Storage.set({ key: "authenticated", value: JSON.stringify(this.authenticated) });
    }
    /**
     * login para android
     */
    async loginGoogleMobile() {

        let googleUser = await Plugins.GoogleAuth.signIn();

        const credential = firebase.default.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);

        this.authenticated = true;
        this.user = googleUser;
        this.saveUserStorage();
        return this.afsAuth.signInAndRetrieveDataWithCredential(credential);

        // const res = await this.googlePlus.login({
        //     webClientId:
        //         "732970608282-p91f1dh0ctqa0fuao0thilbtgdc5rvp4.apps.googleusercontent.com",
        //     offline: true,
        // });
        // const resConfirmed = await this.afsAuth.signInWithCredential(
        //     firebase.default.auth.GoogleAuthProvider.credential(res.idToken)
        // );

        // return this.user;
    }
    /**
     * obtiene el provider de autenticacion de firebase
     * @param providerId
     */
    getProvider(providerId) {
        switch (providerId) {
            case firebase.default.auth.GoogleAuthProvider.PROVIDER_ID:
                return new firebase.default.auth.GoogleAuthProvider();
            case firebase.default.auth.FacebookAuthProvider.PROVIDER_ID:
                return new firebase.default.auth.FacebookAuthProvider();
            default:
                throw new Error(`No provider implemented for ${providerId}`);
        }
    }
}