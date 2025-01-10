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
import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { MessageInterface } from '../../shared/types/message.interface';
import { ContactInterface } from '../../shared/types/contact.interface';

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
})
export class ChatComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() contactKey: string | undefined;
  @Input() name: string | undefined;
  @Input() surname: string | undefined;
  @Input() imgUrl: string | undefined;
  @Input() messages: MessageInterface[] = [];

  @Output() contactDeleted = new EventEmitter<string>();
  @Output() editingStateChanged = new EventEmitter<boolean>();
  @Output() contactUpdated = new EventEmitter<ContactInterface>();
  @Output() lastMessageUpdated = new EventEmitter<{
    contactKey: string;
    lastMessage: string;
    time: string;
  }>();
  @Output() notificationEvent = new EventEmitter<string>();
  @Output() newNotification = new EventEmitter<{ message: string }>();

  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  isEditing: boolean = false;
  editedName: string = '';
  editedSurname: string = '';
  notifications: { name: string; surname: string; message: string }[] = [];

  newMessageContent: string = '';
  isEditingMessage: boolean = false;
  editingMessageKey: string | null = null;
  editingMessage: MessageInterface | null = null;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    console.log('[ngOnInit] - ChatComponent ініціалізовано');

    this.loadMessages();
  }

  ngAfterViewInit(): void {
    console.log('[ngAfterViewInit] - DOM повністю завантажено');

    this.scrollToBottom();
    this.focusMessageInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[ngOnChanges] - Зміни в @Input:', changes);

    if (changes['messages']) {
      this.scrollToBottom();
    }
    if (changes['contactKey'] && this.contactKey) {
      this.loadMessages();
    }
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || !this.contactKey) return;

    if (
      this.isEditingMessage &&
      this.editingMessage &&
      this.editingMessageKey
    ) {
      const updatedMessage: MessageInterface = {
        ...this.editingMessage,
        message: this.newMessageContent.trim(),
        time: new Date().toISOString(),
      };

      this.httpService
        .updateMessage(
          this.contactKey!,
          this.editingMessageKey!,
          updatedMessage
        )
        .subscribe({
          next: () => {
            const index = this.messages.findIndex(
              (msg) => msg.key === this.editingMessageKey
            );
            if (index !== -1) {
              this.messages[index] = updatedMessage;
            }

            this.newMessageContent = '';
            this.isEditingMessage = false;
            this.editingMessage = null;
            this.editingMessageKey = null;
            this.scrollToBottom();
          },
          error: (err) => console.error('Error updating message:', err),
        });
    } else {
      const newMessage: MessageInterface = {
        message: this.newMessageContent.trim(),
        time: new Date().toISOString(),
        sender: 'User',
      };

      this.httpService
        .addMessageToContact(this.contactKey!, newMessage)
        .subscribe({
          next: (response: { name: string }) => {
            newMessage.key = response.name;
            this.messages.push(newMessage);
            this.newMessageContent = '';
            this.scrollToBottom();
            this.updateLastMessageOnServer(newMessage);
            setTimeout(() => this.getBotResponse(), 3000);
          },
          error: (err) => console.error('Error adding message:', err),
        });
    }
  }

  editPerson(): void {
    this.isEditing = true;
    this.editedName = this.name || '';
    this.editedSurname = this.surname || '';
    this.editingStateChanged.emit(true);
  }

  deletePerson(): void {
    if (!this.contactKey) return;

    const confirmation = window.confirm(
      `Are you sure you want to delete this contact: ${this.name} ${this.surname}?`
    );

    if (confirmation) {
      this.httpService.deleteContact(this.contactKey).subscribe({
        next: () => {
          this.contactDeleted.emit(this.contactKey);
        },
        error: (err) => {
          console.error('Error deleting contact:', err);
        },
      });
    }
  }

  selectPerson(contact: ContactInterface): void {
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    this.contactUpdated.emit(contact);
  }

  saveChanges(): void {
    console.log('[saveChanges] - Збереження змін');

    if (!this.contactKey) return;

    const updatedContact: ContactInterface = {
      key: this.contactKey,
      name: this.editedName,
      surname: this.editedSurname,
      imgUrl: this.imgUrl || '',
      lastMessage:
        this.messages.length > 0
          ? this.messages[this.messages.length - 1].message
          : '',
      time: new Date().toISOString(),
    };

    this.httpService.updateContact(this.contactKey, updatedContact).subscribe({
      next: () => {
        this.name = this.editedName;
        this.surname = this.editedSurname;
        this.isEditing = false;
        this.contactUpdated.emit(updatedContact);
        // this.contactUpdated.emit({ ...updatedContact });
        this.editingStateChanged.emit(false);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
      },
    });
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

  private getBotResponse(): void {
    if (!this.contactKey) return;

    this.httpService
      .getBotResponse(this.contactKey, this.name || 'Bot', this.surname || '')
      .subscribe((botMessage) => {
        this.httpService
          .addMessageToContact(this.contactKey!, botMessage)
          .subscribe({
            next: (response) => {
              botMessage.key = response.name;
              this.messages.push(botMessage);

              this.updateLastMessageOnServer(botMessage);
              this.addNotification(
                this.name || '',
                this.surname || '',
                botMessage.message
              );
              this.scrollToBottom();
            },
            error: (err) => console.error('Error adding bot response:', err),
          });
      });
  }

  private updateLastMessageOnServer(lastMessage: MessageInterface): void {
    const updatedContact: Partial<ContactInterface> = {
      lastMessage: lastMessage.message,
      time: lastMessage.time,
    };

    this.httpService.updateContact(this.contactKey!, updatedContact).subscribe({
      next: () => {
        this.lastMessageUpdated.emit({
          contactKey: this.contactKey!,
          lastMessage: lastMessage.message,
          time: lastMessage.time,
        });
      },
      error: (err) => console.error('Error updating last message:', err),
    });
  }

  private loadMessages(): void {
    console.log(
      '[loadMessages] - Завантаження повідомлень для контакту:',
      this.contactKey
    );

    this.httpService.getMessages(this.contactKey!).subscribe((messages) => {
      this.messages = messages || [];
      this.scrollToBottom();

      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1];
        this.lastMessageUpdated.emit({
          contactKey: this.contactKey!,
          lastMessage: lastMessage.message,
          time: lastMessage.time,
        });
      }
    });
  }

  private addNotification(
    name: string,
    surname: string,
    message: string
  ): void {
    const notification = { name, surname, message };
    this.notifications.push(notification);

    setTimeout(() => this.closeNotification(notification), 10000);
  }

  closeNotification(notification: any): void {
    this.notifications = this.notifications.filter((n) => n !== notification);
  }

  editMessage(message: MessageInterface): void {
    if (!message.key) return;

    this.newMessageContent = message.message;
    this.isEditingMessage = true;
    this.editingMessage = message;
    this.editingMessageKey = message.key;
    this.focusMessageInput();
  }
}
