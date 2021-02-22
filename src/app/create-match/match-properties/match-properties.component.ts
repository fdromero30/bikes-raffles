import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
declare var google;
@Component({
    selector: 'app-match-properties',
    templateUrl: 'match-properties.component.html',
    styleUrls: ['match-properties.component.scss']
})
export class MatchPropertiesComponent implements OnInit {
    map;
    constructor(private router: Router, private matchService: MatchService) {
    }

    ngOnInit() {
        const mapEl: HTMLElement = document.getElementById('mapProperties');
        this.map = new google.maps.Map(mapEl, {
            zoom: 12,
            mapTypeId: "terrain",
            mapTypeControl: false,
        });

        const elevator = new google.maps.ElevationService();
        this.displayPathElevation(this.matchService.getGraph().path, elevator, "OK")
    }

    comeBack() {

        this.router.navigate(['tabs/tab2']);
    }


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
   * @param elevations 
   * @param status 
   */
    plotElevation(elevations, status) {
        const chartDiv = document.getElementById("elevation_chart_properties") as HTMLElement;

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
            bottom: 1,
            legend: "none",
            backgroundColor: { fill: 'rgb(244 245 248);' },
            // @ts-ignore TODO(jpoehnelt) update to newest visualization library
            titleY: "Elevation (m)",
        });
    }
}

