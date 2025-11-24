import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { WeatherMap } from './components/weather-map/weather-map';
import { EmergenciesMap } from './components/emergencies-map/emergencies-map';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, WeatherMap, EmergenciesMap],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  currentView: 'weather' | 'emergencies' = 'weather';
  isLoading = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Show splash screen for 2.5 seconds
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 2500);
  }

  onViewChange(view: 'weather' | 'emergencies') {
    this.currentView = view;
  }
}
