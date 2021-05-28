import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { LocationService } from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private stripe: Stripe,
    private locationService: LocationService

  ) {
    this.initializeApp();
  }

  /**
   * 
   */
  initializeApp() {
    this.platform.ready().then(() => {
      this.stripe.setPublishableKey('pk_test_51I8WnbJ7YZdpOXXZBKHZMeWee5mOAE4EjagSAVYfjwvColPIYyR5jKBgDbBdHgJYhiRp1i71BSfED7kaNjcY51r0005wGt0CL7');
      this.statusBar.styleDefault();
      // this.locationService.enableBackgroundGeolocation();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    });
  }

}