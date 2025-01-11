import { MessageRepository } from './messageRepository';
import { BotService as BotService } from '../services/botService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatBot {
  constructor(
    private botService: BotService,
    private messageRepository: MessageRepository
  ) {}

  private delayInSec: number = 3;

  generateMessage(contactKey: string): void {
    setTimeout(() => {
      this.sendMessage(contactKey);
    }, this.delayInSec * 1000);
  }

  private sendMessage(contactKey: string): void {
    this.botService.getBotResponse().subscribe((botMessage) => {
      this.messageRepository.sendMessage(contactKey, botMessage, 'Bot');
    });
  }
}
