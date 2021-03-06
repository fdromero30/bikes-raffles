import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})

export class UserService {
    graph: any;

    constructor(private http: HttpClient) {

    }

    getUserInfo() {
        return this.http.get('assets/jsonMocks/users.json');
    }
}