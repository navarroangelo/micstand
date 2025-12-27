import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
  }

  onViewChange(view: 'weather' | 'emergencies') {
    this.currentView = view;
  }
}
