import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
// import { HttpService } from '../../shared/services/http.service';
import { Contact } from '../../shared/types/contact.interface';
import { MessageRepository } from '../../shared/classes/messageRepository';
import { getDatabase, ref } from 'firebase/database';
import { MessageInterface } from '../../shared/types/message.interface';
import { ChatBot } from '../../shared/classes/chatBot';
import { BotService } from '../../shared/services/botService';

@Component({
  selector: 'app-main-page',
  imports: [HeaderComponent, ChatsComponent, ChatComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  providers: [
    //  Provide messageRepository
    {
      provide: MessageRepository, // The class being provided
      useFactory: () => {
        // Factory function
        const db = getDatabase(); // Get the database instance
        const dbRef = ref(db, 'contacts'); // Correct database reference
        return new MessageRepository(dbRef);
      },
      // deps: [HttpService], // Dependencies of the factory function
    },
    {
      provide: ChatBot,
      useFactory: (
        messageRepository: MessageRepository,
        botService: BotService
      ) => {
        return new ChatBot(botService, messageRepository);
      },
      deps: [MessageRepository],
    },
  ],
})
export class MainPageComponent implements OnInit {
  selectedPerson: Contact | null = null;
  isEditing = false; // Стан редагування
  contacts: Contact[] = [];

  constructor(
    // private httpService: HttpService,
    private messageRepository: MessageRepository
  ) {}

  ngOnInit(): void {
    this.loadAllMessages();
    // this.loadContacts();
  }

  // loadContacts(): void {
  //   this.httpService.getContacts().subscribe({
  //     next: (contacts) => {
  //       this.contacts = contacts;
  //     },
  //     error: (err) => {
  //       console.error('Error loading contacts:', err);
  //     },
  //   });
  // }

  onPersonDeleted(contact: Contact): void {
    this.selectedPerson = null;

    this.contacts = this.contacts.filter((c) => c.key !== contact.key);
  }

  refreshContacts(): void {
    // this.loadContacts();
  }

  loadAllMessages(): void {
    // this.httpService.getContacts().subscribe((allPersons) => {});
  }

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

  onContactUpdated(updatedContact: Contact): void {
    const index = this.contacts.findIndex(
      (contact) => contact.key === updatedContact.key
    );
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }

  onMessagesUpdated(data: {
    contactKey: string;
    messages: MessageInterface[];
  }): void {
    const contactIndex = this.contacts.findIndex(
      (contact) => contact.key === data.contactKey
    );
    const lastMessage = data.messages.slice(-1)[0];
    if (contactIndex !== -1) {
      this.contacts[contactIndex].lastMessage = lastMessage.message;
      this.contacts[contactIndex].time = lastMessage.time;
    }
  }
}
