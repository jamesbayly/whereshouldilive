import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

import { Location } from './models/location';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: []
})
export class AppComponent implements AfterViewInit {
  locations: Location[] = [];
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  markers: google.maps.Marker[] = [];
  heatmap: { location: google.maps.LatLng, weight: number }[] = [];
  currentID: number = 1;
  @ViewChild('gMap', { static: false })
  gMap: GoogleMap | null = null;

  constructor() {
  }

  ngAfterViewInit() { }

  appendLocation() {
    this.locations.push(new Location(this.currentID));
    this.currentID += 1;
    console.log(this.locations);
  }

  removeLocation(id: number) {
    this.locations = this.locations.filter(l => l.id !== id);
    this.markers = this.markers.filter(m => m.getTitle() !== id.toString());
  }

  addMarker(event: google.maps.MapMouseEvent) {
    console.log(event);
    const newLocation = new Location(this.currentID);
    this.currentID += 1;
    newLocation.lat = event.latLng.lat();
    newLocation.lon = event.latLng.lng();
    this.locations.push(newLocation);
    const marker = new google.maps.Marker();
    marker.setTitle(newLocation.id.toString());
    marker.setPosition(event.latLng.toJSON());
    this.markers.push(marker);
  }

  onSubmit() {
    console.log(this.locations);

    this.locations = [
      {id: 1, name: '', lat: 0, lon: 0, visit_count: 1},
      {id: 1, name: '', lat: 0, lon: 5, visit_count: 1},
      {id: 1, name: '', lat: 5, lon: 0, visit_count: 1},
      {id: 1, name: '', lat: 5, lon: 5, visit_count: 1},
    ];

    // create bounding box
    const lats: number[] = this.locations.map(l => l.lat);
    const lngs: number[] = this.locations.map(l => l.lon);

    console.log(lats, lngs);

    const boundingBox: Coord[] = [
      new Coord(Math.min(...lats), Math.max(...lngs)),
      new Coord(Math.max(...lats), Math.max(...lngs)),
      new Coord(Math.max(...lats), Math.min(...lngs)),
      new Coord(Math.min(...lats), Math.min(...lngs)),
    ];

    console.log(boundingBox[0]);


    const numLocations = 25;
    let coords: Coord[] = [];

    let lat = Math.min(...lats);
    let lng = Math.min(...lngs);
    const latInterval = (Math.max(...lats) - lat) / Math.sqrt(numLocations);
    const lngInterval = (Math.max(...lngs) - lng) / Math.sqrt(numLocations);

    while (lat < Math.max(...lats)) {
      lng = Math.min(...lngs);
      while (lng < Math.max(...lngs)) {
        coords.push(new Coord(lat + (latInterval / 2), lng + (lngInterval / 2)));
        lng += lngInterval;
      }
      lat += latInterval;
    }

    this.heatmap = [];
    for (const coord of coords)
    {
      this.heatmap.push({
        location: new google.maps.LatLng(coord.lat, coord.long),
        weight: 1
      });
    }

    const _heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatmap
    });
    if (this.gMap && this.gMap.googleMap) {
      _heatmap.setMap(this.gMap.googleMap);
    }
  }
}

class Coord {
  lat: number = 0;
  long: number = 0;
  

  constructor(_lat: number, _lon: number) {
    this.lat = _lat;
    this.long = _lon;
  }
}
