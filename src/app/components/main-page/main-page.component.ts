import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [HeaderComponent, ChatsComponent, ChatComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  selectedPerson: any = null;

  onPersonSelected(person: any) {
    this.selectedPerson = person;
  }
}
