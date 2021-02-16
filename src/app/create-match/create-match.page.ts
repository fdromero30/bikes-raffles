import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/core';

declare var google;

interface WayPoint {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
}

@Component({
  selector: 'app-create-match',
  templateUrl: 'create-match.page.html',
  styleUrls: ['create-match.page.scss']
})
export class CreateMatchComponent implements OnInit {
  kms = 0;
  longitude: number = 0;
  latitude: number = 0;
  map = null;
  markers: any[] = [];
  directionsService;
  directionsRenderer;
  path = [];
  // parque simon bolivar
  origin = { lat: 4.658383846282959, lng: -74.09394073486328 };
  // Parque la 93
  destination = { lat: 4.676802158355713, lng: -74.04825592041016 };

  wayPoints: WayPoint[] = [];

  constructor() {
    // this.geoLocation();
  }

  ngOnInit() {
    this.initMap();
  }

  /**
   * 
   */
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

    // const latLongIni = { lat: this.latitude, lng: this.longitude };

    this.map = new google.maps.Map(mapEl, {
      center: this.origin,
      zoom: 12,
      mapTypeId: "terrain",
      mapTypeControl: false,
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
      polylineOptions: {
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 2
      }
    });

    this.directionsRenderer.addListener("directions_changed", () => {

      this.computeTotalDistance(this.directionsRenderer.getDirections());
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEl.classList.add('show-map');
    });


    google.maps.event.addListener(this.map, 'click', (event) => {
      console.log(event);
      this.placeMarkerAndPanTo(event.latLng, this.map);
    });

  }

  /**
   * 
   * @param path 
   * @param elevator 
   * @param _map 
   */
  displayPathElevation(
    path,
    elevator,
    _map
  ) {

    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    // Initiate the path request.
    elevator.getElevationAlongPath(
      {
        path: path,
        samples: 256,
      },
      this.plotElevation
    );
  }

  /**
   * 
   * @param latLng 
   * @param map 
   */
  placeMarkerAndPanTo(latLng, map) {

    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      draggable: true
    })

    if (this.markers.length < 1) {
      this.path = [];
      marker.setMap(map);
      this.markers.push(marker);
      this.origin = marker.getPosition();
    } else if (this.markers.length == 1) {
      this.markers.push(marker);
      this.destination = marker.getPosition();
    }

    if (this.markers.length == 2) {
      this.displayRoute(
        this.origin,
        this.destination,
        this.directionsService,
        this.directionsRenderer
      );
      this.deleteMarkers();
    }
  }

  /**
   * 
   */
  clearMarkers() {
    this.setMapOnAll(null);
  }

  /**
   * 
   */
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  /**
   * 
   * @param map 
   */
  setMapOnAll(map: any | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  /**
   * 
   * @param elevations 
   * @param status 
   */
  plotElevation(elevations, status) {
    const chartDiv = document.getElementById("elevation_chart") as HTMLElement;

    if (status !== "OK") {
      // Show the error code inside the chartDiv.
      chartDiv.innerHTML =
        "Cannot show elevation: request failed because " + status;
      return;
    }
    // Create a new chart in the elevation_chart DIV.
    const chart = new google.visualization.AreaChart(chartDiv);

    // Extract the data from which to populate the chart.
    // Because the samples are equidistant, the 'Sample'
    // column here does double duty as distance along the
    // X axis.
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Sample");
    data.addColumn("number", "Elevation");

    for (let i = 0; i < elevations.length; i++) {
      data.addRow(["", elevations[i].elevation]);
    }

    // Draw the chart using the data within its DIV.
    chart.draw(data, {
      height: 120,
      width: 260,
      bottom: 1,
      legend: "none",
      backgroundColor: { fill: '#ffc409' },
      // @ts-ignore TODO(jpoehnelt) update to newest visualization library
      titleY: "Elevation (m)",
    });
  }

  /**
   * 
   * @param origin 
   * @param destination 
   * @param service 
   * @param display 
   */
  displayRoute(
    origin: any,
    destination: any,
    service: any,
    display: any
  ) {
    service.route(
      {
        origin: origin,
        destination: destination,
        waypoints: this.wayPoints,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      },
      (result, status) => {
        if (status === "OK") {

          for (var j = 0, len = result.routes[0].overview_path.length; j < len; j++) {
            this.path.push(result.routes[0].overview_path[j]);
          }

          setTimeout(() => {
            // Create an ElevationService.
            const elevator = new google.maps.ElevationService();

            // Draw the path, using the Visualization API and the Elevation service.
            this.displayPathElevation(this.path, elevator, this.map);
          }, 10);


          display.setDirections(result);
          console.log(result);
        } else {
          alert("Could not display directions due to: " + status);
        }
      }
    );
  }

  /**
   * 
   * @param result 
   */
  computeTotalDistance(result: any) {
    let total = 0;
    const myroute = result.routes[0];
    if (!myroute) {
      return;
    }
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i]!.distance!.value;
    }
    total = total / 1000;
    this.kms = total;

  }

  /**
   * 
   */
  clickGhrap(event) {

    console.log(event);
  }
}

