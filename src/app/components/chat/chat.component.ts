import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
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
export class ChatComponent implements AfterViewInit, OnChanges {
  @Input() name: string | undefined;
  @Input() surname: string | undefined;
  @Input() imgUrl: string | undefined;
  @Input() messages: Array<any> = [];
  @Output() personDeleted = new EventEmitter<void>();
  @Output() editingStateChanged = new EventEmitter<boolean>(); // Стан редагування

  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  isEditing = false; // Чи перебуває компонент у режимі редагування
  editedName: string = '';
  editedSurname: string = '';
  newMessageContent: string = ''; // Введений текст повідомлення
  private inputStates: Record<string, string> = {}; // Зберігання стану інпутів за ім’ям контакту
  notifications: { name: string; surname: string; message: string }[] = [];
  // private activeChatName: string | null = null;
  private activeChatContact: { name: string; surname: string } | null = null;

  constructor(private httpService: HttpService) {}

  ngAfterViewInit(): void {
    this.scrollToBottom();
    this.focusMessageInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.scrollToBottom();
    }

    if (changes['name'] && changes['name'].currentValue) {
      // Зберігаємо попередній стан
      if (changes['name'].previousValue) {
        this.inputStates[changes['name'].previousValue] =
          this.newMessageContent;
      }

      // Встановлюємо стан для нового контакту
      this.newMessageContent =
        this.inputStates[changes['name'].currentValue] || '';
      this.focusMessageInput(); // Фокус на інпуті
    }
  }

  editPerson() {
    this.isEditing = true;
    this.editedName = this.name || '';
    this.editedSurname = this.surname || '';
    this.editingStateChanged.emit(true); // Повідомляємо про початок редагування
  }

  saveChanges() {
    const updatedPerson = {
      originalName: this.name, // Для ідентифікації контакту
      name: this.editedName,
      surname: this.editedSurname,
    };
    this.httpService.updatePerson(updatedPerson);
    this.isEditing = false;
    this.name = this.editedName;
    this.surname = this.editedSurname;
    this.editingStateChanged.emit(false); // Повідомляємо про завершення редагуванн
  }

  cancelChanges() {
    this.isEditing = false;
    this.editingStateChanged.emit(false); // Повідомляємо про завершення редагування
  }

  deletePerson() {
    this.httpService.deletePerson(this.name || '');
    this.personDeleted.emit();
  }

  isMyMessage(sender: string): boolean {
    return sender === 'AndriiBoiyarin';
  }

  sendMessage() {
    if (!this.newMessageContent || !this.name) {
      return; // Не дозволяємо відправляти порожні повідомлення
    }

    const newMessage = {
      message: this.newMessageContent,
      time: new Date().toISOString(),
      sender: 'AndriiBoiyarin', // Ідентифікатор вашого користувача
    };

    this.httpService.addMessageToPerson(this.name!, newMessage); // Оновлюємо повідомлення через сервіс
    this.updateMessages(); // Оновлюємо список повідомлень
    this.newMessageContent = ''; // Очищаємо поле вводу
    this.focusMessageInput(); // Повертаємо фокус на інпут
    this.activeChatContact = { name: this.name!, surname: this.surname || '' }; // Зберігаємо ім’я активного чату

    setTimeout(() => {
      this.getBotResponse(this.activeChatContact); // Передаємо ім’я активного чату
    }, 3000);
  }

  private focusMessageInput() {
    setTimeout(() => {
      this.messageInput.nativeElement.focus(); // Фокус на інпуті
    }, 0);
  }

  private updateMessages() {
    const currentPersons = this.httpService.getCurrentPersons(); // Отримуємо актуальний список контактів
    const currentPerson = currentPersons.find(
      (person) => person.name === this.name
    );
    if (currentPerson) {
      this.messages = currentPerson.message; // Оновлюємо список повідомлень
      this.scrollToBottom();
    }
  }

  private getBotResponse(contact: { name: string; surname: string } | null) {
    if (!contact) return; // Якщо контакт не передано, виходимо

    this.httpService.getRandomQuote().subscribe((quote) => {
      const botMessage = {
        message: quote,
        time: new Date().toISOString(),
        sender: contact.name, // Ім'я співрозмовника
      };

      this.httpService.addMessageToPerson(contact.name, botMessage); // Додаємо відповідь у правильний чат
      if (this.name === contact.name) {
        this.updateMessages(); // Оновлюємо локальний список, якщо чат відкрито
      }

      // Відображаємо нотифікацію
      this.showNotification(contact.name, contact.surname, quote);
    });
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const nativeElement = this.chatContainer.nativeElement;
      setTimeout(
        () => (nativeElement.scrollTop = nativeElement.scrollHeight),
        0
      );
    }
  }

  private showNotification(name: string, surname: string, message: string) {
    console.log('Notification created:', { name, surname, message });
    const notification = { name, surname, message };
    this.notifications.push(notification);

    // Автоматичне закриття через 5 секунд
    setTimeout(() => {
      this.notifications = this.notifications.filter((n) => n !== notification);
      console.log('Notification removed:', notification);
    }, 15000);
  }

  closeNotification(notification: any) {
    this.notifications = this.notifications.filter((n) => n !== notification);
  }
}
