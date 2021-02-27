import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-resume-tracking-session',
  templateUrl: './resume-tracking-session.component.html',
  styleUrls: ['./resume-tracking-session.component.scss'],
})
export class ResumeTrackingSessionComponent implements OnInit {

  tracks: any;
  constructor() { }

  ngOnInit() {

    Storage.get({ key: 'track-activity' }).then(res => {
      this.tracks = JSON.stringify(res);
    });

  }

}
