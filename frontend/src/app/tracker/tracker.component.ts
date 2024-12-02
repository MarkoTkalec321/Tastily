import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../_services/storage.service";
import {SharedService} from "../_services/shared.service";
import {MatTableDataSource} from "@angular/material/table";
import {FlatOrder} from "../model/FlatOrder";

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements AfterViewInit, OnInit {

  private map!: L.Map;
  currentUser: any;
  dataSourceFromProfile: MatTableDataSource<FlatOrder> = new MatTableDataSource<FlatOrder>([]);
  estimatedTravelTime: string = '';
  filteredOrders: MatTableDataSource<FlatOrder> = new MatTableDataSource<FlatOrder>([]);
  displayedColumns: string[] = ['orderId', 'image', 'name', 'quantity', 'status'];

  private redMarker = new L.Icon({
    iconUrl: 'assets/marker-icon-red.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  private blueIcon = new L.Icon({
    iconUrl: 'assets/marker-icon-blue.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient,
              private storageService: StorageService,
              private sharedService: SharedService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.fetchCurrentUser();
  }

  ngOnInit(): void {

    this.sharedService.fetchDataAndPrepare();

    this.sharedService.dataSource$.subscribe(dataSource => {
      console.log("Received data in TrackerComponent:", dataSource.data);
      if (dataSource && dataSource.data && dataSource.data.length) {
        this.dataSourceFromProfile = dataSource;
        this.updateFilteredOrders();
        console.log("Updated dataSourceFromProfile:", this.dataSourceFromProfile.data);
      } else {
        // If data is empty, trigger a fetch
        this.sharedService.fetchData();
      }
    });

    if (!this.dataSourceFromProfile.data.length) {
      this.sharedService.fetchData();
    }
  }

  hasOnTheWayOrders(): boolean {
    return this.dataSourceFromProfile.data.some(order => order.status === 'On the way');
  }

  updateFilteredOrders(): void {
    const onTheWayOrders = this.dataSourceFromProfile.data.filter(order => order.status === 'On the way');
    console.log('way ', onTheWayOrders)
    this.filteredOrders.data = onTheWayOrders;
  }

  private initMap(): void {
    const defaultLat = 45.79548177393039;
    const defaultLng = 15.968990296928686;
    this.map = L.map('map', {
      center: [defaultLat, defaultLng],
      zoom: 16
    });
    // Add the tile layer to the map
    const tiles = L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, © CartoDB'
    }).addTo(this.map);
    this.map.zoomControl.setPosition('bottomright');
    tiles.addTo(this.map);
    // Add the default marker to the map
    L.marker([defaultLat, defaultLng], {icon: this.blueIcon})
      .addTo(this.map)
      .bindPopup('Tastily');
  }

  private fetchCurrentUser(): void {
    this.currentUser = this.storageService.getUser();
    if (this.currentUser && this.currentUser.addressDTO) {
      const userLat = this.currentUser.addressDTO.latitude;
      const userLng = this.currentUser.addressDTO.longitude;
      if (userLat && userLng) {
        this.getRoute(userLat + ',' + userLng);
        L.marker([userLat, userLng], {icon: this.redMarker})
          .addTo(this.map)
          .bindPopup(`${this.currentUser.username}`)
      }
    }
  }

  private getRoute(end: string): void {
    const start = "45.79548177393039,15.968990296928686";
    const apiKey = '687db199-e852-456a-b8d9-f57d6d4044c3';
    const url = `https://graphhopper.com/api/1/route?point=${start}&point=${end}&vehicle=car&locale=de&key=${apiKey}&type=json`;
    this.http.get<any>(url).subscribe(response => {
      if (response.paths && response.paths.length > 0) {
        const path = response.paths[0];
        // Check if additionalMinutes is not in localStorage before calling calculateTime
        if (!localStorage.getItem('additionalMinutes')) {
          this.calculateTime(path.time);
        } else {
          const travelTimeMinutes = Math.round(path.time / 60000); // Convert to minutes
          const totalTravelTime = travelTimeMinutes + parseInt(localStorage.getItem('additionalMinutes')!);
          this.estimatedTravelTime = `Estimated delivery time: ${totalTravelTime} minutes`;
        }
        const coordinates = this.decodePath(path.points);
        const route = L.polyline(coordinates, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(route.getBounds());
      }
    }, error => {
      console.error("Error fetching route: ", error);
    });
  }

  private calculateTime(travelTimeMilliseconds: number): void {
    // Convert to minutes
    const travelTimeMinutes = Math.round(travelTimeMilliseconds / 60000);
    let additionalMinutes = localStorage.getItem('additionalMinutes');
    // If additionalMinutes doesn't exist in localStorage, generate and set it
    if (!additionalMinutes) {
      // This generates a random number between 15 (inclusive) and 20 (inclusive)
      additionalMinutes = (Math.floor(Math.random() * 6) + 15).toString();
      localStorage.setItem('additionalMinutes', additionalMinutes);
    }
    const totalTravelTime = travelTimeMinutes + parseInt(additionalMinutes);
    this.estimatedTravelTime = `Estimated delivery time: ${totalTravelTime} minutes`;
  }

  private decodePath(encoded: string) {
    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;

    while (index < len) {
      var b;
      var shift = 0;
      var result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      array.push([lat / 1E5, lng / 1E5]);
    }

    return array as L.LatLngExpression[];
  }
}
