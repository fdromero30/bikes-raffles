import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/core';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  longitude: number = 0;
  latitude: number = 0;
  map = null;

  constructor() {
    this.geoLocation();
  }

  ngOnInit() {
    
  }

  async geoLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.longitude = position.coords.longitude;
    this.latitude = position.coords.latitude;
    this.initMap();
  }

  /**
   * 
   */
  initMap() {
    const mapEl: HTMLElement = document.getElementById('map');

    const latLongIni = { lat: this.latitude, lng: this.longitude };

    this.map = new google.maps.Map(mapEl, {
      center: latLongIni,
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEl.classList.add('show-map');
    })
  }
}

