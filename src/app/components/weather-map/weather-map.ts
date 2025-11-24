import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherAlertCard } from '../weather-alert-card/weather-alert-card';
import { AiChatbotButton } from '../ai-chatbot-button/ai-chatbot-button';
import * as L from 'leaflet';

@Component({
  selector: 'app-weather-map',
  imports: [CommonModule, WeatherAlertCard, AiChatbotButton],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.css',
})
export class WeatherMap implements OnInit, AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markers: L.Marker[] = [];

  evacuationCenters = [
    { id: 1, name: 'Balibago Evacuation Center', lat: 15.1663, lng: 120.5901, capacity: 500, status: 'available' },
    { id: 2, name: 'Malabañas Evacuation Center', lat: 15.1509, lng: 120.5898, capacity: 300, status: 'limited' },
    { id: 3, name: 'Pandan Evacuation Center', lat: 15.1522, lng: 120.6054, capacity: 800, status: 'available' },
  ];

  weatherAlerts = [
    {
      id: 1,
      type: 'typhoon',
      severity: 'high',
      title: 'Typhoon Pepito',
      message: 'Typhoon Pepito approaching. Secure loose items, charge devices, prepare 3-day emergency kit.',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'storm-surge',
      severity: 'medium',
      title: 'Storm Surge',
      message: 'Coastal areas at risk. Move to higher ground immediately for safety and follow evacuation orders.',
      timestamp: new Date()
    }
  ];

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
      attributionControl: true,
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
      attribution: '© OpenStreetMap contributors',
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
}
