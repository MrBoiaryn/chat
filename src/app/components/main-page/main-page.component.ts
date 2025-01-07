import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-main-page',
  imports: [
    HeaderComponent,
    ChatsComponent,
    ChatComponent,
    CommonModule,
    NotificationComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  selectedPerson: any = null;
  isEditing = false; // Стан редагування

  // onPersonSelected(person: any) {
  //   this.selectedPerson = person;
  // }
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
}
