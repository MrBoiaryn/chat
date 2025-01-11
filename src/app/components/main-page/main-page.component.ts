import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
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
    {
      provide: MessageRepository,
      useFactory: () => {
        const db = getDatabase();
        const dbRef = ref(db, 'contacts');
        return new MessageRepository(dbRef);
      },
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
export class MainPageComponent {
  selectedPerson: Contact | null = null;
  isEditing = false;
  contacts: Contact[] = [];

  onPersonDeleted(contact: Contact): void {
    this.selectedPerson = null;

    this.contacts = this.contacts.filter((c) => c.key !== contact.key);
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
