import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import Validation from "../utils/validation";
import {StorageService} from "../_services/storage.service";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    fullname: new FormControl(''),
    email: new FormControl(''),
    addressInput: new FormControl(''),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    password: new FormControl(''),
  });
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  backendErrorMessage: string = '';
  successMessage: string = '';
  public addressError = '';
  private map!: L.Map;
  private currentMarker?: L.Marker;
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

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private storageService: StorageService,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {

    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.form = this.formBuilder.group(
      {
        fullname: ['',
          [
            Validators.required,
            Validators.maxLength(255)
          ]
        ],
        username: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50)
          ]
        ],
        addressInput: ['',
          [
          Validators.required,
          Validators.maxLength(255),
            Validators.pattern(/^.+,\s*\d+$/)
          ]
        ],
        latitude: [''],
        longitude: [''],
        email: ['',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(255)
          ]
        ],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(255)
          ]
        ],
        confirmPassword: ['',
          [
          Validators.required
          ]
        ],
      },
      {
        validators: [
          Validation.match('password', 'confirmPassword'),
          this.addressInZagrebValidator()
          ]
      }
    );

    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([45.81327539117001, 15.977286740476393], 13);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, © CartoDB'
    }).addTo(this.map);
    this.map.zoomControl.setPosition('bottomright');

    const defaultLat = 45.79548177393039;
    const defaultLng = 15.968990296928686;

    L.marker([defaultLat, defaultLng], {icon: this.blueIcon})
      .addTo(this.map)
      .bindPopup('Tastily')
      .openPopup();

    setTimeout(() => {
      this.map.closePopup();
    }, 2000);
    this.map.on('click', this.onMapClick.bind(this));
  }

  private onMapClick(event: L.LeafletMouseEvent): void {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    this.getAddress(lat, lng).subscribe(address => {
      const addressControl = this.form.get('addressInput');
      const latControl = this.form.get('latitude');
      const lngControl = this.form.get('longitude');

      if (addressControl && latControl && lngControl) {
        addressControl.setValue(address);
        latControl.setValue(lat);
        lngControl.setValue(lng);
      }

      // Split the address into its components to check if it's in Zagreb
      this.isAddressInZagreb(lat, lng).subscribe(data => {
        if (data.isValid && data.city.toLowerCase() === 'zagreb') {
          // Clear the notInZagreb error if it exists
          if (addressControl) {
            addressControl.setErrors({notInZagreb: null});
            addressControl.updateValueAndValidity();
          }

          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }

          this.currentMarker = L.marker([lat, lng], {icon: this.redMarker})
            .bindPopup(address)
            .addTo(this.map)
            .openPopup();
        } else {
          if (addressControl) {
            addressControl.setErrors({notInZagreb: true});
          }
        }
      });
    });
  }

  private getAddress(lat: number, lng: number): Observable<string> {
    const apiKey = '687db199-e852-456a-b8d9-f57d6d4044c3';
    const url = `https://graphhopper.com/api/1/geocode?point=${lat},${lng}&reverse=true&key=${apiKey}&locale=hr`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.hits && response.hits.length > 0) {
          const hit = response.hits[0];

          if (hit.housenumber && hit.housenumber.trim() !== '') {
            return `${hit.name}, ${hit.housenumber}`;
          } else {
            this.addressError = 'House number not available. Please select a different location.';
            return 'House number not available. Please select a different location.';
          }
        }
        return '';
      }),
      catchError(err => {
        console.error("HTTP Error:", err);
        this.addressError = 'An error occurred while fetching the address. Please try again.';
        return of('House number not available. Please select a different location.');
      })
    );
  }

  addressInZagrebValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const latitudeControl = control.get('latitude');
      const longitudeControl = control.get('longitude');

      const latitude = latitudeControl?.value;
      const longitude = longitudeControl?.value;

      let inZagreb = false;

      if (latitude && longitude) {
        this.isAddressInZagreb(latitude, longitude).subscribe(data => {
          if (data.isValid && data.city.toLowerCase() === 'zagreb') {
            inZagreb = true;
          }
        });
      }

      return inZagreb ? null : {notInZagreb: {value: control.value}};
    };
  }

  isAddressInZagreb(lat: number, lng: number): Observable<{isValid: boolean, city: string}> {
    const apiKey = '687db199-e852-456a-b8d9-f57d6d4044c3';
    const url = `https://graphhopper.com/api/1/geocode?point=${lat},${lng}&reverse=true&key=${apiKey}&locale=hr`;

    console.log('Checking location at latitude:', lat, ' and longitude:', lng);
    console.log('URL:', url);

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.hits && response.hits.length > 0) {
          const hit = response.hits[0];
          const isValid = hit.country === "Hrvatska" || hit.countrycode === "HR";
          const city = hit.city || '';
          return {isValid, city};
        }
        return {isValid: false, city: ''};
      }),
      catchError(err => {
        console.error("HTTP Error:", err);
        throw err;
      })
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    const { username, fullname, email, addressInput, latitude, longitude, password } = this.form.value;
    const [street, houseNumber] = addressInput.split(',').slice(-2).map((item: string) => item.trim());
    const combinedAddress = `${street} ${houseNumber}`;

    this.isAddressInZagreb(latitude, longitude).subscribe(isValid => {
      if (isValid) {

        const userData = { username, fullname, email, address: combinedAddress, latitude, longitude, password };
        console.log('User Data:', userData);
        this.authService.register(username, fullname, email, combinedAddress, password, latitude, longitude).subscribe({
          next: data => {
            console.log(data);
            this.successMessage = data.message;
            setTimeout(() => {
              this.successMessage = '';
            }, 5000); // 5 seconds
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.backendErrorMessage = '';
          },
          error: err => {
            console.error("Error:", err);
            if (err.error && err.error.message) {
              this.backendErrorMessage = err.error.message;
            } else {
              this.backendErrorMessage = 'An unexpected error occurred.';
            }
            this.isSignUpFailed = true;
          }
        });
      } else {
        this.errorMessage = "Invalid address or address not in Zagreb.";
        this.isSignUpFailed = true;
      }
    });
  }

}
