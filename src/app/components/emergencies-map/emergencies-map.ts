import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmergencyReportButton } from '../emergency-report-button/emergency-report-button';
import { AiChatbotButton } from '../ai-chatbot-button/ai-chatbot-button';
import * as L from 'leaflet';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Emergency, EmergencyApiResponse } from '../../models/emergency.model';

@Component({
  selector: 'app-emergencies-map',
  imports: [CommonModule, EmergencyReportButton, AiChatbotButton],
  templateUrl: './emergencies-map.html',
  styleUrl: './emergencies-map.css',
})
export class EmergenciesMap implements OnInit, AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markers: L.Marker[] = [];
  private destroy$ = new Subject<void>();
  isStatsOpen = false;
  emergencies: Emergency[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEmergencies();
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

  onReportSubmitted() {
    this.getEmergencies();
  }

  private getEmergencies() {
    this.http.get<{ record: Emergency[] }>('https://api.jsonbin.io/v3/b/692432b0d0ea881f40fcb70a', {
      headers: {
        'X-Master-Key': environment.jsonBinApiKey
      }
    }).pipe(
      takeUntil(this.destroy$),
      catchError((error: HttpErrorResponse) => {
        this.emergencies = [];
        return of(null);
      })
    ).subscribe((data) => {
      if (data && Array.isArray(data.record)) {
        this.emergencies = data.record;
      } else {
        this.emergencies = [];
      }
      this.updateMarkers();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addEmergencyMarkers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Center on Angeles City, Philippines
    this.map = L.map('emergenciesMap', {
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

  private addEmergencyMarkers(): void {
    if (!this.map) return;

    this.emergencies.forEach((emergency: Emergency) => {
      const typeColor = this.getEmergencyTypeColor(emergency.type);
      const icon = this.getEmergencyIcon(emergency.type);

      const customIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: `<div style="background-color: ${typeColor}; width: 35px; height: 35px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px;">${icon}</div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([emergency.location.lat, emergency.location.lng], { icon: customIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${emergency.address}</h3>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${emergency.type}</p>
            <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${this.getSeverityColor(emergency.severity)}; text-transform: capitalize;">${emergency.severity}</span></p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Reported:</strong> ${new Date(emergency.timestamp).toLocaleString()}</p>
          </div>
        `);

      this.markers.push(marker);
    });
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Re-add markers
    this.addEmergencyMarkers();
  }

  getEmergencyIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'fire': '🔥',
      'flood': '🌊',
      'earthquake': '🏚️'
    };
    return icons[type] || '⚠️';
  }

  getEmergencyTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'fire': '#f97316',        // Red-orange for fire
      'flood': '#3b82f6',       // Blue for flood/storm
      'earthquake': '#92400e'   // Brown for earthquake
    };
    return colors[type] || '#ef4444';
  }

  getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#3b82f6'
    };
    return colors[severity] || '#3b82f6';
  }

  getEmergencyCountBySeverity(severity: string): number {
    return this.emergencies.filter(e => e.severity === severity).length;
  }

  getEmergencyCountByType(type: string): number {
    return this.emergencies.filter(e => e.type === type).length;
  }

  toggleStats(): void {
    this.isStatsOpen = !this.isStatsOpen;
  }
}
