import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-main-page',
  imports: [HeaderComponent, ChatsComponent, ChatComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  selectedPerson: any = null;
  isEditing = false; // Стан редагування
  selectedChat: any = null;
  allMessages: Array<{
    chatName: string;
    message: string;
    time: string;
    surname: string;
  }> = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadAllMessages();
  }

  private loadAllMessages() {
    this.httpService.getPersonsData().subscribe((allPersons) => {
      this.allMessages = allPersons.flatMap((person: any) =>
        person.message.map((msg: any) => ({
          chatName: person.name,
          surname: person.surname || '',
          message: msg.message,
          time: msg.time,
        }))
      );
    });
  }

  onPersonSelected(person: any) {
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    this.selectedPerson = person;
  }

  onEditingStateChanged(isEditing: boolean) {
    this.isEditing = isEditing; // Оновлюємо стан редагування
  }

  onPersonDeleted() {
    this.selectedPerson = null; // Скидаємо вибір після видалення
    this.isEditing = false; // Скидаємо стан редагування після видалення
  }

  openChat(chat: {
    chatName: string;
    surname: string;
    message: string;
    time: string;
  }) {
    console.log('Chat to open:', chat.chatName); // Виводимо ім'я чату для діагностики

    // Знаходимо вибраний чат у списку
    this.selectedChat = this.allMessages.find(
      (item) => item.chatName === chat.chatName
    );

    console.log('Selected chat details:', this.selectedChat); // Виводимо деталі обраного чату
  }
}
