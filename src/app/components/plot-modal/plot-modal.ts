import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plot-modal',
  imports: [CommonModule],
  templateUrl: './plot-modal.html',
  styleUrl: './plot-modal.css',
})
export class PlotModal {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() data: any = null;
  @Input() type: 'evacuation' | 'emergency' = 'evacuation';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
