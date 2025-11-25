import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() activeView: 'weather' | 'emergencies' = 'weather';
  @Output() viewChange = new EventEmitter<'weather' | 'emergencies'>();

  windowWidth: number = window.innerWidth;

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  }

  setActiveView(view: 'weather' | 'emergencies') {
    this.activeView = view;
    this.viewChange.emit(view);
  }
}
