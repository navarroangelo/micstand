import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherAlertCard } from '../weather-alert-card/weather-alert-card';
import { AiChatbotButton } from '../ai-chatbot-button/ai-chatbot-button';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-map',
  imports: [CommonModule, WeatherAlertCard, AiChatbotButton],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.css',
})
export class WeatherMap implements OnInit, AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markers: L.Marker[] = [];
  isAlertsExpanded = false;
  isCentersOpen = false;

  evacuationCenters = [
    { id: 1, name: 'Balibago Evacuation Center', lat: 15.1663, lng: 120.5901, capacity: 500, status: 'available' },
    { id: 2, name: 'Malabañas Evacuation Center', lat: 15.1509, lng: 120.5898, capacity: 300, status: 'limited' },
    { id: 3, name: 'Pandan Evacuation Center', lat: 15.1522, lng: 120.6054, capacity: 800, status: 'available' },
    { id: 4, name: 'Cutud Community Center', lat: 15.1400, lng: 120.5950, capacity: 450, status: 'available' },
    { id: 5, name: 'Anunas Elementary School', lat: 15.1700, lng: 120.5850, capacity: 600, status: 'available' },
    { id: 6, name: 'Sapangbato Evacuation Site', lat: 15.1800, lng: 120.6000, capacity: 350, status: 'limited' },
    { id: 7, name: 'Pulung Maragul Gymnasium', lat: 15.1450, lng: 120.6100, capacity: 700, status: 'available' },
    { id: 8, name: 'Santo Rosario Community Hall', lat: 15.1550, lng: 120.5800, capacity: 400, status: 'available' },
    { id: 9, name: 'Margot Covered Court', lat: 15.1600, lng: 120.6150, capacity: 500, status: 'limited' },
    { id: 10, name: 'Claro M. Recto High School', lat: 15.1350, lng: 120.5850, capacity: 900, status: 'available' },
    { id: 11, name: 'Salapungan Barangay Hall', lat: 15.1650, lng: 120.6050, capacity: 250, status: 'available' },
    { id: 12, name: 'Lourdes Sur Evacuation Center', lat: 15.1480, lng: 120.5920, capacity: 550, status: 'available' },
  ];

  weatherAlerts: any[] = [];

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit(): void {
    // Fix for default marker icon issue with webpack
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
      this.initMap();
      this.addEvacuationMarkers();

      this.fetchWeatherAlerts();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Center on Angeles City, Philippines
    this.map = L.map('weatherMap', {
      center: [15.1433, 120.5833],
      zoom: 13,
      zoomControl: false,
      preferCanvas: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      zoomAnimation: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '',
      tileSize: 256,
      updateWhenIdle: false,
      updateWhenZooming: false,
      keepBuffer: 2,
      crossOrigin: true
    }).addTo(this.map);

    // Force map to invalidate size multiple times to ensure proper rendering
    setTimeout(() => this.map?.invalidateSize(true), 0);
    setTimeout(() => this.map?.invalidateSize(true), 100);
    setTimeout(() => this.map?.invalidateSize(true), 250);
    setTimeout(() => this.map?.invalidateSize(true), 500);
    setTimeout(() => this.map?.invalidateSize(true), 1000);
  }

  private addEvacuationMarkers(): void {
    if (!this.map) return;

    // Use highly contrasting colors that match legend exactly
    const availableColor = '#10b981'; // Vibrant emerald green
    const limitedColor = '#f59e0b';   // Bright amber orange

    this.evacuationCenters.forEach(center => {
      const statusColor = center.status === 'available' ? availableColor : limitedColor;

      const customIcon = L.divIcon({
        className: 'custom-evacuation-marker',
        html: `<div style="background-color: ${statusColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([center.lat, center.lng], { icon: customIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${center.name}</h3>
            <p style="margin: 4px 0;"><strong>Capacity:</strong> ${center.capacity} people</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; text-transform: capitalize;">${center.status}</span></p>
          </div>
        `);

      this.markers.push(marker);
    });
  }

  toggleAlerts(): void {
    this.isAlertsExpanded = !this.isAlertsExpanded;
  }

  getEvacuationCenterCountByStatus(status: string): number {
    return this.evacuationCenters.filter(c => c.status === status).length;
  }

  toggleCenters(): void {
    this.isCentersOpen = !this.isCentersOpen;
  }

  private fetchWeatherAlerts(): void {
    const url = 'https://hackathon-flow.stage.cloud.cloudstaff.com/webhook/9cec53fa-93b4-440d-abf9-1adc685a122a/incoming-disaster?q=8.72902001373351,125.75056459392184';

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response && response.incoming_disasters) {
          this.zone.run(() => {
            this.weatherAlerts = response.incoming_disasters.map((d: any, index: number) => ({
              id: index + 1,
              type: d.type,
              severity: d.severity,
              title: d.title,
              message: d.message,
              timestamp: new Date(d.timestamp)
            }));
          });

          console.log('Loaded disaster alerts', this.weatherAlerts);
        }
      },
      error: (error) => {
        console.error('Failed to load disaster alerts', error);
      }
    });
  }
}
