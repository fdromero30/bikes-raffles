import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { StripeService } from '../services/stripe.service';
import { LocationService } from '../services/location.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  raffles: any;

  constructor(private stripe: StripeService, private locationSevice: LocationService) {
    this.raffles = [{
      subtitle: "test", title: "PlayStation5", content: "10 dias", img: "https://www.easypromosapp.com/blog/wp-content/uploads/header_ideas_promocionales_para_sortear_una_bicicleta.jpg",
      percent: 0.1
    },
    {
      subtitle: "test", title: "Xbox Series X", content: "5 dias", img: "https://laventanaciudadana.cl/wp-content/uploads/2016/10/loteria.jpg",
      percent: 0.9
    },
    {
      subtitle: "test", title: "Air Freezer", content: "1 dia", img: "https://actualicese.com/_ig/img/fotos/rifas.jpg",
      percent: 0.56
    }];

    // this.saveCard();
  }

  loadData(event) {

    const data = ["", "", ""];
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  saveCard() {

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    }
    console.log(this.stripe.getToken(card));

  }

  onClick() {
    this.locationSevice.startTracking();

    
  }
}
