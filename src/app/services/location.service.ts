import { Plugins } from '@capacitor/core';
import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/core';
import { Subject } from 'rxjs';
const { Storage } = Plugins;
declare var google;

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    graph: any;
    isTracking = false;
    watch: any;
    locationsCollection: Subject<any> = new Subject<any>();
    map;
    constructor() {

    }

    getActualPosition() {
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 30000
        });
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
        this.locationsCollection.next({
            lat,
            lng,
            timestamp
        });
    }

    /** */
    saveTrackActivity(val) {
        Storage.set({ key: 'track-activity', value: val });
    }
}