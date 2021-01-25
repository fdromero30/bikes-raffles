import { Injectable } from "@angular/core";
import { Stripe } from '@ionic-native/stripe/ngx';

@Injectable({
    providedIn: 'root'
})

export class StripeService {
    constructor(private stripe: Stripe) {

    }

    getToken(card) {
        this.stripe.createCardToken(card)
            .then(token => { return token.id })
            .catch(error => console.error(error));

    }
}