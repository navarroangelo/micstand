import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency-report-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './emergency-report-button.html',
  styleUrl: './emergency-report-button.css',
})
export class EmergencyReportButton {
  isModalOpen = false;
  selectedType: string | null = null;
  additionalDetails = '';

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
    if (!this.selectedType) return;

    const selectedEmergency = this.emergencyTypes.find(t => t.id === this.selectedType);

    console.log('Emergency Report Submitted:', {
      type: this.selectedType,
      label: selectedEmergency?.label,
      details: this.additionalDetails,
      timestamp: new Date(),
      // In production, this would include GPS coordinates
      location: 'GPS coordinates would be captured here'
    });

    // TODO: Send data to backend/n8n webhook
    // TODO: Get actual GPS location
    // TODO: Show success notification

    // Close modal and reset
    this.closeModal();

    // Show success message (you can implement a toast notification here)
    alert(`${selectedEmergency?.label} emergency reported successfully! Authorities have been notified.`);
  }
}
