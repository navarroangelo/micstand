import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeatherAlert {
  id: number;
  type: string;
  severity: string;
  title: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-weather-alert-card',
  imports: [CommonModule],
  templateUrl: './weather-alert-card.html',
  styleUrl: './weather-alert-card.css',
})
export class WeatherAlertCard {
  @Input() alert!: WeatherAlert;
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getSeverityClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-white border-l-4 border-red-500';
      case 'medium': return 'bg-white border-l-4 border-orange-500';
      case 'low': return 'bg-white border-l-4 border-blue-500';
      default: return 'bg-white border-l-4 border-blue-500';
    }
  }

  getSeverityBadgeClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-500 text-white border-red-500';
      case 'medium': return 'bg-orange-500 text-white border-orange-500';
      case 'low': return 'bg-blue-500 text-white border-blue-500';
      default: return 'bg-blue-500 text-white border-blue-500';
    }
  }

  getIconBgClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  }

  getTypeIcon() {
    switch (this.alert.type) {
      case 'typhoon': return '🌀';
      case 'storm-surge': return '🌊';
      case 'wind': return '💨';
      case 'flood': return '🌧️';
      default: return '⚠️';
    }
  }

  getModalHeaderClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-50/50';
      case 'medium': return 'bg-orange-50/50';
      case 'low': return 'bg-blue-50/50';
      default: return 'bg-blue-50/50';
    }
  }

  getButtonClass() {
    switch (this.alert.severity) {
      case 'high': return 'btn-error text-white';
      case 'medium': return 'btn-warning text-white';
      case 'low': return 'btn-info text-white';
      default: return 'btn-info text-white';
    }
  }

  getAccentClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-blue-500';
    }
  }
}
