import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-chatbot-button',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ai-chatbot-button.html',
  styleUrl: './ai-chatbot-button.css',
})
export class AiChatbotButton implements OnInit {
  isChatOpen = false;
  public form: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      userInput: new FormControl(''),
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  onSubmit(event: Event) {
    if (this.form.valid) {
      const userInput = this.form.get('userInput')?.value;
      this.form.reset();
    }
  }
}
