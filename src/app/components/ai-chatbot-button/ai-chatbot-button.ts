import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-chatbot-button',
  imports: [CommonModule],
  templateUrl: './ai-chatbot-button.html',
  styleUrl: './ai-chatbot-button.css',
})
export class AiChatbotButton {
  isChatOpen = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
}
