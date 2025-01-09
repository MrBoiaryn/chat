import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';
import { ContactInterface } from '../../shared/types/contact.interface';

@Component({
  selector: 'app-main-page',
  imports: [HeaderComponent, ChatsComponent, ChatComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  selectedPerson: ContactInterface | null = null;
  isEditing = false; // Стан редагування
  contacts: ContactInterface[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadAllMessages();
    this.loadContacts();
  }

  loadContacts(): void {
    this.httpService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      },
    });
  }

  onPersonDeleted(contactKey: string): void {
    this.selectedPerson = null; // Скидаємо вибраний контакт

    this.contacts = this.contacts.filter(
      (contact) => contact.key !== contactKey
    );
  }

  refreshContacts(): void {
    this.loadContacts(); // Метод для оновлення контактів
  }

  loadAllMessages(): void {
    this.httpService.getContacts().subscribe((allPersons) => {
      console.log('All messages loaded:', allPersons);
    });
  }

  // onPersonSelected(contact: ContactInterface): void {
  //   if (this.isEditing) {
  //     alert('You cannot switch chats while editing.');
  //     return;
  //   }
  //   this.selectedPerson = contact ?? null;
  // }

  onPersonSelected(person: any) {
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    this.selectedPerson = person;
  }

  onEditingStateChanged(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  onContactUpdated(updatedContact: ContactInterface): void {
    const index = this.contacts.findIndex(
      (contact) => contact.key === updatedContact.key
    );
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }

  onLastMessageUpdated(data: {
    contactKey: string;
    lastMessage: string;
    time: string;
  }): void {
    const contactIndex = this.contacts.findIndex(
      (contact) => contact.key === data.contactKey
    );
    if (contactIndex !== -1) {
      this.contacts[contactIndex].lastMessage = data.lastMessage;
      this.contacts[contactIndex].time = data.time;
    }
  }
}
