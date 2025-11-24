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
  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  getSeverityClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-50 border-l-4 border-red-500';
      case 'medium': return 'bg-orange-50 border-l-4 border-orange-500';
      case 'low': return 'bg-blue-50 border-l-4 border-blue-500';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
    }
  }

  getSeverityBadgeClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }

  getIconBgClass() {
    switch (this.alert.severity) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getTypeIcon() {
    switch (this.alert.type) {
      case 'typhoon': return '🌀';
      case 'flood': return '🌊';
      case 'rain': return '🌧️';
      case 'wind': return '💨';
      default: return '⚠️';
    }
  }
}
