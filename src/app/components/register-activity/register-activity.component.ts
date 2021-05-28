import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

const { Network } = Plugins;
declare var google;
interface WayPoint {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
}

@Component({
  selector: 'app-register-activity',
  templateUrl: './register-activity.component.html',
  styleUrls: ['./register-activity.component.scss'],
})
export class RegisterActivityComponent implements OnInit {



  trackLocations = [];
  showFinishBtn = false;
  locationsCollection;
  locations;
  locationsCollectionArray: any;
  longitude: number = 0;
  latitude: number = 0;
  map = null;
  markers: any[] = [];
  directionsService;
  directionsRenderer;
  path = [];
  origin = null;
  destination = null;
  wayPoints: WayPoint[] = [];
  showBackdrop = true;
  gpsStatus = 'connecting';
  activityPause = true;
  segmentSport: any;
  networkStatus: boolean;
  user;

  constructor(private locationService: LocationService, private router: Router, private authService: AuthService,
    private afs: AngularFirestore) {
    this.geoLocation();
    this.locationsCollectionArray = [];
    this.user = this.authService.user;

    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus = status.connected;
    });

    this.locationsCollection = this.afs.collection(
      `locations/${this.user.id}/${Date.now()}`,
      ref => ref.orderBy('timestamp')
    );

    // Make sure we also get the Firebase item ID!
    this.locations = this.locationsCollection.snapshotChanges().pipe(
      map((actions: any) =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }


  ngOnInit() {
    // this.geoLocation();
    this.initMap();
    this.segmentSport = "Cyclism";
  }

  /**
   * 
   */
  async geoLocation() {
    const position = await this.locationService.getActualPosition();
    if (position) {
      this.gpsStatus = 'connected';
      setTimeout(() => {
        this.gpsStatus = 'connected-drop';
      }, 4000);
    }
    this.longitude = position.coords.longitude;
    this.latitude = position.coords.latitude;
    this.initMap();
  }

  /**
   * 
   */
  initMap() {
    const mapEl: HTMLElement = document.getElementById('mapActivity');

    let latLongIni = { lat: this.latitude, lng: this.longitude };

    this.map = new google.maps.Map(mapEl, {

      center: latLongIni,
      zoom: 16,
      mapTypeId: "terrain",
      mapTypeControl: false,
      disableDefaultUI: true,
      rotateControl: true,


    });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.

    const bogota = { lat: 4.6097100, lng: -74.0817500 };
    if (!latLongIni.lat || !latLongIni.lng) {
      latLongIni = bogota;
    }

    const centerControlDiv = document.createElement("div");
    new CenterControl(centerControlDiv, this.map, latLongIni);

    // @ts-ignore
    centerControlDiv.index = 1;
    centerControlDiv.style.paddingTop = "50px";
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);


    const marker = new google.maps.Marker({
      position: latLongIni,
      map: this.map,
      draggable: false
    })

    marker.setMap(this.map);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEl.classList.add('show-map');
    });

  }

  /**
   * 
   * @param event 
   */
  segmentChanged(event) {
    console.log(event);
    this.segmentSport = event.detail.value;

  }

  /**
   * 
   */
  startTracking() {

    if (this.activityPause) {
      this.activityPause = false;
      this.showFinishBtn = false;
      this.locationService.startTracking();
      this.locationService.locationsCollection.subscribe(res => {

        this.trackLocations.push(res);

        this.latitude = res.lat;
        this.longitude = res.lng;
        const latLong = { lat: this.latitude, lng: this.longitude };

        this.locationsCollectionArray.push(latLong);
        this.locationsCollection.add(res);

        this.saveTrackActivity();
        this.drawRoute();
      })
    } else {
      this.activityPause = true;
      this.showFinishBtn = true;
      this.locationService.stopTracking();
    }

  }

  /**
   * 
   */
  drawRoute(): void {

    const flightPath = new google.maps.Polyline({
      path: this.locationsCollectionArray,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    flightPath.setMap(this.map);
  }


  /** 
   * 
  */
  saveTrackActivity() {
    const trackValue = JSON.stringify(this.trackLocations);
    this.locationService.saveTrackActivity(trackValue);
  }

  finisgTracking() {
    this.locationService.stopTracking();
    alert('Sesion finalziada');
    this.router.navigate(['tabs/resume-tracking-session']);
  }
}

class CenterControl {
  private map_: any;
  private center_: any;
  constructor(
    controlDiv: HTMLElement,
    map: any,
    center: any
  ) {
    this.map_ = map;
    // Set the center property upon construction
    this.center_ = new google.maps.LatLng(center);
    controlDiv.style.clear = "both";

    // Set CSS for the control border
    const goCenterUI = document.createElement("div");
    goCenterUI.id = "goCenterUI";
    goCenterUI.title = "Click to recenter the map";
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    const goCenterText = document.createElement("div");
    goCenterText.id = "goCenterText";
    goCenterText.style.marginRight = '20px';
    goCenterText.style.background = '#ffc409';
    goCenterText.style.height = '40px';
    goCenterText.style.width = "40px";
    goCenterText.style.textAlign = "center";
    goCenterText.style.padding = "13.5%";
    goCenterText.style.borderRadius = "25px";
    goCenterText.style.fontSize = "1.5rem";
    goCenterText.style.marginBottom = "50px";
    goCenterUI.appendChild(goCenterText);


    const span = document.createElement("ion-icon");
    span.name = "locate-outline";
    span.id = "locate-map"
    goCenterText.appendChild(span);

    // Set CSS for the setCenter control border
    const setCenterUI = document.createElement("div");
    setCenterUI.id = "setCenterUI";
    setCenterUI.title = "Click to change the center of the map";
    controlDiv.appendChild(setCenterUI);

    // Set CSS for the control interior
    // const setCenterText = document.createElement("div");
    // setCenterText.id = "setCenterText";
    // setCenterText.innerHTML = "Set Center";
    // setCenterUI.appendChild(setCenterText);

    // Set up the click event listener for 'Center Map': Set the center of
    // the map
    // to the current center of the control.
    goCenterUI.addEventListener("click", () => {
      const currentCenter = this.center_;
      this.map_.setCenter(currentCenter);
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    setCenterUI.addEventListener("click", () => {
      const newCenter = this.map_.getCenter()!;

      if (newCenter) {
        this.center_ = newCenter;
      }
    });
  }

}