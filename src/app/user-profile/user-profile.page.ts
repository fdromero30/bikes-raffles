import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Chart } from 'chart.js';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.page.html',
  styleUrls: ['user-profile.page.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  user: UserModel;
  @ViewChild('radarStatistics') private radarStatistics: ElementRef;
  myRadarChart: any;
  segmentSport: string;

  constructor(private userService: UserService) {
    this.user = new UserModel();
    this.segmentSport = "Cycling";

  }


  ngOnInit() {



  }

  ngAfterViewInit() {
    this.initUser();
    const el = document.getElementById('cyclismButtonSegment');
    if (el) {
      el.classList.remove('segment-button-after-checked');
      el.classList.add('segment-button-checked');
    }
  }

  /**
   * 
   */
  initUser() {
    this.userService.getUserInfo().subscribe((userResp: any) => {
      this.user = userResp;
      this.setCyclingChart();
    });

  }

  /**
   * 
   */
  setCyclingChart() {
    const data = {
      labels: ['Velocidad', 'Resistencia', 'Escalador', 'Potencia', 'Explosion', 'Equilibrio', 'Downhill'],
      datasets: [{
        label: 'Average Cycling Hability',
        data: this.user.userCyclingStatistics,
        fill: true,
        backgroundColor: '#36abe08c', // array should have same number of elements as number of dataset
        borderColor: '#50c8ff',// array should have same number of elements as number of dataset
        borderWidth: 1
      }]
    }

    const options = {
      scale: {
        angleLines: {
          display: true
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
          fontSize: 10,
          backdropColor: '#101111'
        },
        gridLines: {
          lineWidth: 1,
          color: "gray"
        },
        pointLabels: {
          fontSize: 10,
          fontStyle: "bold",
          color: '#ffc409'
        }
      }
    };
    this.myRadarChart = new Chart(this.radarStatistics.nativeElement, {
      type: 'radar',
      data: data,
      options: options
    });
  }

  setRunningChart() {
    const data = {
      labels: ['Velocidad', 'Resistencia', 'Potencia', 'Explosion', 'Trail'],
      datasets: [{
        label: 'Average Running Hability',
        data: this.user.userRunningStatistics,
        fill: true,
        backgroundColor: '#36abe08c', // array should have same number of elements as number of dataset
        borderColor: '#50c8ff',// array should have same number of elements as number of dataset
        borderWidth: 1
      }]
    }

    const options = {
      scale: {
        angleLines: {
          display: true
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
          fontSize: 10,
          backdropColor: '#101111'
        },
        gridLines: {
          lineWidth: 1,
          color: "gray"
        },
        pointLabels: {
          fontSize: 10,
          fontStyle: "bold",
          color: '#ffc409'
        }
      }
    };
    this.myRadarChart = new Chart(this.radarStatistics.nativeElement, {
      type: 'radar',
      data: data,
      options: options
    });

  }

  /**
   * 
   * @param event 
   */
  segmentChanged(event) {

    if (event.detail.value === 'Running') {

      const el = document.getElementById('cyclismButtonSegment');
      if (el) {
        el.classList.add('segment-button-after-checked');
        el.classList.remove('segment-button-checked');
      }
      this.setRunningChart();
    } else {
      this.setCyclingChart();
    }

  }

}


