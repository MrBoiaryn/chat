import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
// import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { MessageInterface } from '../../shared/types/message.interface';
import { Contact } from '../../shared/types/contact.interface';
import { MessageRepository } from '../../shared/classes/messageRepository';
import { ChatBot } from '../../shared/classes/chatBot';
import { BotService } from '../../shared/services/botService';

const me = 'Andrii Boiyarin';
@Component({
  selector: 'app-chat',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    NotificationComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [
    ChatBot, // Provide ChatBot
    BotService, // Provide BotService
    // MessageRepository,
  ],
})
export class ChatComponent implements AfterViewInit, OnInit {
  @Input() contact: Contact | null = null;
  @Input() name: string | undefined;
  @Input() surname: string | undefined;
  @Input() imgUrl: string | undefined;
  @Input() messages: MessageInterface[] = [];

  @Output() contactDeleted = new EventEmitter<Contact>();
  @Output() editingStateChanged = new EventEmitter<boolean>();
  @Output() contactUpdated = new EventEmitter<Contact>();
  @Output() messagesUpdated = new EventEmitter<{
    contactKey: string;
    messages: MessageInterface[];
  }>();

  @Output() notificationEvent = new EventEmitter<string>();
  @Output() newNotification = new EventEmitter<{ message: string }>();

  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  isEditing: boolean = false;
  editedName: string = '';
  editedSurname: string = '';
  notifications: { name: string; message: string }[] = [];

  newMessageContent: string = '';
  isEditingMessage: boolean = false;
  editingMessageKey: string | null = null;
  editingMessage: MessageInterface | null = null;
  lastMessage: MessageInterface | null = null;

  constructor(
    private messageRepository: MessageRepository,
    private chatBot: ChatBot
  ) {}

  ngOnInit(): void {
    // console.log('[ngOnInit] - ChatComponent ініціалізовано');

    this.subscribe();

    // console.log(this.messages);
    this.loadMessages();
  }

  ngAfterViewInit(): void {
    // console.log('[ngAfterViewInit] - DOM повністю завантажено');

    this.scrollToBottom();
    this.focusMessageInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('[ngOnChanges] - Зміни в @Input:', changes);

    if (changes['messages']) {
      this.scrollToBottom();
    }
    if (changes['contact'] && this.contact) {
      this.loadMessages();
    }
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || !this.contact) return;

    if (this.editingMessage) {
      const updatedMessage: MessageInterface = {
        ...this.editingMessage,
        message: this.newMessageContent.trim(),
        time: new Date().toISOString(),
      };

      this.messageRepository.editMessage(
        this.contact.key!,
        this.editingMessageKey!,
        updatedMessage
      );
    } else {
      this.messageRepository.sendMessage(
        this.contact.key!,
        this.newMessageContent.trim()
      );
      this.newMessageContent = '';
      this.focusMessageInput();
      this.chatBot.generateMessage(this.contact.key!);
    }
  }

  editPerson(): void {
    this.isEditing = true;
    this.editedName = this.name || '';
    this.editedSurname = this.surname || '';
    this.editingStateChanged.emit(true);
  }

  deletePerson(): void {
    if (!this.contact) return;

    const confirmation = window.confirm(
      `Are you sure you want to delete this contact: ${this.name} ${this.surname}?`
    );

    if (confirmation) {
      this.contactDeleted.emit(this.contact);
      this.messageRepository.deleteContact(this.contact.key!);
    }
  }

  selectPerson(contact: Contact): void {
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    this.contactUpdated.emit(contact);
  }

  saveChanges(): void {
    // console.log('[saveChanges] - Збереження змін');

    if (!this.contact) return;

    const updatedContact: Contact = {
      key: this.contact.key,
      name: this.editedName,
      surname: this.editedSurname,
      imgUrl: this.imgUrl || '',
      lastMessage:
        this.messages.length > 0
          ? this.messages[this.messages.length - 1].message
          : '',
      time: new Date().toISOString(),
      messages: this.messages,
    };
    this.name = this.editedName;
    this.surname = this.editedSurname;
    this.isEditing = false;
    this.contactUpdated.emit(updatedContact);
    // this.contactUpdated.emit({ ...updatedContact });
    this.editingStateChanged.emit(false);
    this.messageRepository.updateContact(this.contact.key!, updatedContact);
    this.focusMessageInput();
  }

  cancelChanges(): void {
    this.isEditing = false;
    this.editingStateChanged.emit(false);
  }

  isMyMessage(sender: string): boolean {
    return sender === 'User';
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const nativeElement = this.chatContainer.nativeElement;
      setTimeout(() => {
        nativeElement.scrollTop = nativeElement.scrollHeight;
      }, 100);
    }
  }

  private focusMessageInput(): void {
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 0);
  }

  private subscribe(): void {
    this.messageRepository.contactUpdated$.subscribe((contact) => {
      if (
        this.messages.length > 0 &&
        contact?.messages &&
        contact?.messages.length > this.messages.length
      ) {
        for (let i = this.messages.length; i < contact.messages.length; i++) {
          if (contact.messages[i].sender != 'Bot') continue;

          this.addNotification(
            contact.name + ' ' + contact.surname,
            contact.messages[i].message
          );
        }
      }

      this.messages = contact?.messages.slice() || [];
      this.scrollToBottom();

      console.log(this.messages);

      if (this.messages.length > 0) {
        this.messagesUpdated.emit({
          contactKey: this.contact?.key!,
          messages: this.messages,
        });
      }
    });
  }

  loadMessages(): void {
    this.messages =
      this.messageRepository.getContact(this.contact?.key!)?.messages || [];
    this.focusMessageInput();
  }

  private addNotification(name: string, message: string): void {
    const notification = { name, message };
    this.notifications.push(notification);

    setTimeout(() => this.closeNotification(notification), 10000);
  }

  closeNotification(notification: any): void {
    this.notifications = this.notifications.filter((n) => n !== notification);
  }

  editMessage(message: MessageInterface): void {
    console.log('work');
    if (!message.key) return;

    this.newMessageContent = message.message;
    this.isEditingMessage = true;
    this.editingMessage = message;
    this.editingMessageKey = message.key;
    this.focusMessageInput();
  }
}
