import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})

export class MatchService {
    graph: any;
    distance: any;

    constructor() {

    }


    getActualPosition() {
        return Geolocation.getCurrentPosition();
    }

    setGraph(graphEvent) {
        this.graph = graphEvent;
    }

    getGraph() {
        return this.graph;
    }

    setDistance(distance) {
        this.distance = distance;
    }
    getDistance() {
        return this.distance;
    }
}