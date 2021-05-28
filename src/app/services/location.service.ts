import { Plugins } from '@capacitor/core';
import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/core';
import { Subject } from 'rxjs';
const { Storage } = Plugins;

// import {
//     BackgroundGeolocation
//     , BackgroundGeolocationConfig
//     , BackgroundGeolocationEvents
//     , BackgroundGeolocationResponse
// } from '@ionic-native/background-geolocation/ngx';


@Injectable({
    providedIn: 'root'
})

export class LocationService {
    graph: any;
    isTracking = false;
    watch: any;
    locationsCollection: Subject<any> = new Subject<any>();
    map;

    // config: BackgroundGeolocationConfig = {
    //     desiredAccuracy: 10,
    //     stationaryRadius: 20,
    //     distanceFilter: 30,
    //     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    //     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    // };
    constructor(
        // private backgroundGeolocation: BackgroundGeolocation
    ) {

    }
    /**
     * 
     */
    // enableBackgroundGeolocation() {
    //     this.backgroundGeolocation.configure(this.config)
    //         .then(() => {

    //             debugger;
    //             this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
    //                 console.log(location);

    //                 // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //                 // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
    //                 // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //                 this.backgroundGeolocation.finish(); // FOR IOS ONLY
    //             });

    //         });
    // }

    /**
     * 
     */
    getActualPosition() {
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 30000
        });
    }

    /**
     * 
     */
    startTracking() {

        // start recording location
        // this.backgroundGeolocation.start();
        let prevPosition = { latitude: null, longitude: null };
        this.isTracking = true;
        this.watch = Geolocation.watchPosition({ timeout: 100, enableHighAccuracy: false }, (position, err) => {
            if (position) {

                if (prevPosition.latitude !== position.coords.latitude && prevPosition.longitude !== position.coords.longitude) {
                    prevPosition.latitude = position.coords.latitude;
                    prevPosition.longitude = position.coords.longitude;

                    this.addNewLocation(
                        position.coords.latitude,
                        position.coords.longitude,
                        position.timestamp
                    );
                }
            }
        });
    }

    // Unsubscribe from the geolocation watch using the initial ID
    stopTracking() {
        // If you wish to turn OFF background-tracking, call the #stop method.
        // this.backgroundGeolocation.stop();
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