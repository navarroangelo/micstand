import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emergency-report-button',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './emergency-report-button.html',
  styleUrl: './emergency-report-button.css',
})
export class EmergencyReportButton implements OnInit {
  isModalOpen = false;
  selectedType: string | null = null;
  additionalDetails = '';
  userLocation: { latitude: number; longitude: number } | null = null;
  public form: FormGroup = new FormGroup({});
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string | null = null;

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
    //geolocation permission request could be added here
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.form.get('userLocation')?.setValue({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        console.log('Geolocation permission granted:', position);
      },
      (error) => {
        console.error('Geolocation permission denied or error:', error);
      }
    );
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationError = null; // Clear any previous errors
          console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);
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
          console.error('Geolocation Error:', this.locationError);
        },
        {
          enableHighAccuracy: true, // Request more accurate location
          timeout: 10000,          // Maximum time to wait for a response (10 seconds)
          maximumAge: 0            // Don't use a cached position
        }
      );
    } else {
      this.locationError = 'Geolocation is not supported by this browser.';
      console.error(this.locationError);
    }
  }

  onSubmit(event: Event) {
    if(this.form.valid) {
      console.log('Form Submitted:', this.form.value);
    } else {
      console.error('Form is invalid');
      //missing required fields handling could be added here
      console.log(this.form.value);
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

    const selectedEmergency = this.emergencyTypes.find(t => t.id === this.selectedType);

    console.log('Emergency Report Submitted:', {
      type: this.selectedType,
      label: selectedEmergency?.label,
      details: this.additionalDetails,
      timestamp: new Date(),
      // In production, this would include GPS coordinates
      location: 'GPS coordinates would be captured here'
    });

    let oldData: any;
    this.http.get('assets/json/emergencies.json').subscribe((data: any) => {
      oldData = data;
      console.log('Old Data:', oldData);
      if(oldData !== null) {
        const newReport = {
          id: oldData.length + 1, // Random ID for demo purposes
          type: this.selectedType,
          location: 'User provided location or GPS coordinates',
          lat: this.latitude,
          lng: this.longitude,
          severity: 'medium', // Default severity for demo purposes
          details: this.additionalDetails,
          timestamp: new Date()
        };
        oldData.push(newReport);
        // Update local storage
        localStorage.setItem('emergencies', JSON.stringify(oldData));
        console.log('Updated Data:', oldData);
      }
    });
    


    // TODO: Send data to backend/n8n webhook
    // TODO: Get actual GPS location
    // TODO: Show success notification

    // Close modal and reset
    // this.closeModal();

    // Show success message (you can implement a toast notification here)
    // alert(`${selectedEmergency?.label} emergency reported successfully! Authorities have been notified.`);
  }
}
