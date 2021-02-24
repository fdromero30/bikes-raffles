import { Plugins } from '@capacitor/core';
import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/core';
const { Storage } = Plugins;
declare var google;

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    graph: any;
    isTracking = false;
    watch: any;
    locationsCollection: any;
    map;
    constructor() {
        this.locationsCollection = [];

    }

    getActualPosition() {
        return Geolocation.getCurrentPosition();
    }

    startTracking() {
        this.isTracking = true;
        this.watch = Geolocation.watchPosition({ timeout: 100, enableHighAccuracy: false }, (position, err) => {
            if (position) {
                this.addNewLocation(
                    position.coords.latitude,
                    position.coords.longitude,
                    position.timestamp
                );
            }
        });
    }

    // Unsubscribe from the geolocation watch using the initial ID
    stopTracking() {
        Geolocation.clearWatch({ id: this.watch }).then(() => {
            this.isTracking = false;
        });
    }


    /**
     * 
     * @param lat 
     * @param lng 
     * @param timestamp 
     */
    addNewLocation(lat, lng, timestamp) {
        this.locationsCollection.push({
            lat,
            lng,
            timestamp
        });
        alert(new google.maps.LatLng(lat, lng));

    }
}