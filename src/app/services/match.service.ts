import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})

export class MatchService {
    graph: any;

    constructor() {

    }


    getActualPosition() {
        return Geolocation.getCurrentPosition();
    }

    setGraph(graphEvent) {
        this.graph = graphEvent;
    }

    getGraph(){
        return this.graph;
    }
}