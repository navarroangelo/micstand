import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Emergency, GeocodingResponse } from '../../models/emergency.model';

@Component({
  selector: 'app-emergency-report-button',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './emergency-report-button.html',
  styleUrl: './emergency-report-button.css',
})
export class EmergencyReportButton implements OnInit, OnDestroy {
  @Output() reportSubmitted = new EventEmitter<void>();

  isModalOpen = false;
  selectedType: string | null = null;
  additionalDetails = '';
  userLocation: { latitude: number; longitude: number } | null = null;
  public form: FormGroup = new FormGroup({});
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string | null = null;
  userAddress: string | null = null;

  private destroy$ = new Subject<void>();

  emergencyTypes = [
    {
      id: 'fire',
      label: 'Fire',
      icon: '🔥',
      description: 'Building fire, forest fire, or fire hazard'
    },
    {
      id: 'flood',
      label: 'Flood',
      icon: '🌊',
      description: 'Flash flood, river overflow, or water accumulation'
    },
    {
      id: 'earthquake',
      label: 'Earthquake',
      icon: '🏚️',
      description: 'Ground shaking, structural damage, or aftershocks'
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.form = new FormGroup({
      'emergencyType': new FormControl('', Validators.required),
      'additionalDetails': new FormControl('', Validators.required),
      'userLocation': new FormControl(''),
    });
    this.getLocation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationError = null;
          this.form.get('userLocation')?.setValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.getAddress(position.coords.latitude, position.coords.longitude);
        },
        (error: GeolocationPositionError) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.locationError = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.locationError = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.locationError = 'The request to get user location timed out.';
              break;
            default:
              this.locationError = 'An unknown error occurred.';
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.locationError = 'Geolocation is not supported by this browser.';
    }
  }

  onSubmit(event: Event) {
    if (this.form.valid) {
      this.submitReport();
    } else {
      this.locationError = 'Please fill in all required fields';
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.selectedType = null;
    this.additionalDetails = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedType = null;
    this.additionalDetails = '';
  }

  selectType(typeId: string) {
    this.selectedType = typeId;
  }

  submitReport() {
    if (!this.selectedType && !this.form.valid) return;

    this.http.get<{ record: Emergency[] }>('https://api.jsonbin.io/v3/b/692432b0d0ea881f40fcb70a', {
      headers: {
        'X-Master-Key': environment.jsonBinApiKey
      }
    }).pipe(
      takeUntil(this.destroy$),
      catchError((error: HttpErrorResponse) => {
        this.locationError = 'Failed to fetch emergency data. Please try again.';
        return of(null);
      })
    ).subscribe((data) => {
      if (!data) return;

      const oldData = data.record;
      if (oldData !== null) {
        const newReport: Emergency = {
          type: this.selectedType as 'fire' | 'flood' | 'earthquake',
          location: {
            lat: this.latitude!,
            lng: this.longitude!
          },
          address: this.userAddress || 'Unknown location',
          severity: 'medium',
          description: this.additionalDetails,
          timestamp: new Date().toISOString()
        };

        const updatedData = [...oldData, newReport];

        this.http.put('https://api.jsonbin.io/v3/b/692432b0d0ea881f40fcb70a', updatedData, {
          headers: {
            'X-Master-Key': environment.jsonBinApiKey,
            'Content-Type': 'application/json'
          }
        }).pipe(
          takeUntil(this.destroy$),
          catchError((error: HttpErrorResponse) => {
            this.locationError = 'Failed to submit report. Please try again.';
            return of(null);
          })
        ).subscribe((response) => {
          if (!response) return;

          this.reportSubmitted.emit();
          const body = {
            address: this.userAddress,
            type: this.selectedType
          };
          this.sendDisasterNotification(body);
          this.closeModal();
        });
      }
    });
  }

  sendDisasterNotification(body: { address: string | null; type: string | null }) {
    this.http.post('https://hackathon-flow.stage.cloud.cloudstaff.com/webhook/9cec53fa-93b4-440d-abf9-1adc685a122a/disaster-warning', body)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error: HttpErrorResponse) => {
          return of(null);
        })
      )
      .subscribe();
  }

  getAddress(lat: number | null, lng: number | null): void {
    if (lat === null || lng === null) {
      return;
    }
    this.http.get<GeocodingResponse>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error: HttpErrorResponse) => {
          this.locationError = 'Failed to fetch address';
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.address) {
          this.userAddress = [
            response.address.road,
            response.address.suburb,
            response.address.city,
            response.address.state,
            response.address.country
          ].filter(Boolean).join(', ');
        }
      });
  }
}
