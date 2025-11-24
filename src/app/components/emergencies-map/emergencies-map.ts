import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmergencyReportButton } from '../emergency-report-button/emergency-report-button';
import { AiChatbotButton } from '../ai-chatbot-button/ai-chatbot-button';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emergencies-map',
  imports: [CommonModule, EmergencyReportButton, AiChatbotButton],
  templateUrl: './emergencies-map.html',
  styleUrl: './emergencies-map.css',
})
export class EmergenciesMap implements OnInit, AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markers: L.Marker[] = [];

  isFiltersExpanded = false;

  constructor(private elementRef: ElementRef) {}

  emergencyTypes = [
    { id: 'fire', label: 'Fire', icon: '🔥', active: true },
    { id: 'flood', label: 'Flood', icon: '🌊', active: true },
    { id: 'earthquake', label: 'Earthquake', icon: '🏚️', active: true },
  ];

  constructor(private http: HttpClient) {}

  //get emergencies from JSON file
  // public/assets/json/emergencies.json
  emergencies: any[] = [];

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

  private getEmergencies() {
    this.http.get<any[]>('assets/json/emergencies.json').subscribe((data: any) => {
      //save to localstorage
      // localStorage.setItem('emergencies', JSON.stringify(data));
      this.emergencies = localStorage.getItem('emergencies') ? JSON.parse(localStorage.getItem('emergencies')!) : data;
      this.updateMarkers();
    });
  }

  ngAfterViewInit(): void {
      this.initMap();
      this.addEmergencyMarkers();
  }

  ngOnDestroy(): void {
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

  private addEmergencyMarkers(): void {
    if (!this.map) return;

    // Use highly contrasting colors that match badges exactly
    const highSeverityColor = '#ef4444';  // Vibrant red
    const mediumSeverityColor = '#f59e0b'; // Bright amber orange
    const lowSeverityColor = '#3b82f6';    // Vivid blue

    this.getFilteredEmergencies().forEach((emergency: any) => {
      const severityColor = emergency.severity === 'high' ? highSeverityColor :
                           emergency.severity === 'medium' ? mediumSeverityColor : lowSeverityColor;
      const icon = this.getEmergencyIcon(emergency.type);

      const customIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: `<div style="background-color: ${severityColor}; width: 35px; height: 35px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px;">${icon}</div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([emergency.lat, emergency.lng], { icon: customIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${emergency.location}</h3>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${emergency.type}</p>
            <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${severityColor}; text-transform: capitalize;">${emergency.severity}</span></p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Reported:</strong> ${emergency.timestamp.toLocaleString()}</p>
          </div>
        `);

      this.markers.push(marker);
    });
  }

  toggleFilter(typeId: string) {
    const type = this.emergencyTypes.find(t => t.id === typeId);
    if (type) {
      type.active = !type.active;
      this.updateMarkers();
    }
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Re-add filtered markers
    this.addEmergencyMarkers();
  }

  getFilteredEmergencies() {
    const activeTypes = this.emergencyTypes.filter(t => t.active).map(t => t.id);
    return this.emergencies.filter(e => activeTypes.includes(e.type));
  }

  getEmergencyIcon(type: string): string {
    return this.emergencyTypes.find(t => t.id === type)?.icon || '⚠️';
  }

  getActiveFilterCount(): number {
    return this.emergencyTypes.filter(t => t.active).length;
  }

  getEmergencyCountByType(typeId: string): number {
    return this.emergencies.filter(e => e.type === typeId).length;
  }

  getEmergencyCountBySeverity(severity: string): number {
    return this.emergencies.filter(e => e.severity === severity).length;
  }

  toggleFiltersExpanded(event: Event) {
    event.stopPropagation();
    this.isFiltersExpanded = !this.isFiltersExpanded;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isFiltersExpanded) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.isFiltersExpanded = false;
      }
    }
  }
}
