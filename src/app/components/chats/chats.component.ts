import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HttpService } from '../../shared/services/http.service';
import { MaxlengthPipe } from '../../shared/pipes/maxlength.pipe';
import { Contact } from '../../shared/types/contact.interface';
import { MessageRepository } from '../../shared/classes/messageRepository';

@Component({
  selector: 'app-chats',
  imports: [CommonModule, MaxlengthPipe],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  @Input() contacts: Contact[] = [];
  // @Input() contacts: Set<Contact> = new Set();
  @Input() isEditing: boolean = false;

  @Output() personSelected = new EventEmitter<Contact>();
  selectedContact: Contact | null = null;

  private previousContacts: string = '';

  constructor(private messageRepository: MessageRepository) {}

  ngOnInit(): void {
    // console.log('[ngOnInit] - ChatsComponent ініціалізовано');
    this.loadContacts();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // console.log('[ngOnChanges] - Зміни в @Input:', changes);
  //   if (changes['contacts'] && !changes['contacts'].firstChange) {
  //     this.sortContacts();
  //   }
  // }

  // ngDoCheck(): void {
  //   const currentContacts = JSON.stringify(this.contacts);
  //   if (currentContacts !== this.previousContacts) {
  //     // console.log('[ngDoCheck] - Контакти змінилися');

  //     this.previousContacts = currentContacts;
  //     this.sortContacts();
  //   }
  // }

  loadContacts(): void {
    this.messageRepository.contactUpdated$.subscribe((contact) => {
      console.log(contact);
      if (contact) {
        const index = this.contacts.findIndex((c) => c.key === contact.key);
        if (index !== -1) {
          this.contacts[index] = contact;
        } else {
          this.contacts.push(contact);
        }
        this.sortContacts();
      }
    });
  }

  selectPerson(contact: Contact): void {
    if (this.selectedContact === contact) return;
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    // console.log('[selectPerson] - Обраний контакт:', contact);

    this.selectedContact = contact;
    // this.sortContacts();
    this.personSelected.emit(contact);
  }

  onContactDeleted(contact: Contact): void {
    this.contacts = this.contacts.filter((contact) => {
      return contact.key !== contact.key;
    });
    // this.sortContacts();
  }

  // deleteContact(contactKey: string): void {
  //   this.httpService.deleteContact(contactKey).subscribe({
  //     next: () => {
  //       this.loadContacts();
  //     },
  //     error: (err) => {
  //       console.error('Error deleting contact:', err);
  //     },
  //   });
  // }

  private sortContacts(): void {
    // console.log('[sortContacts] - Сортування контактів');

    this.contacts.sort((a, b) => {
      const dateA = new Date(a.time || '').getTime();
      const dateB = new Date(b.time || '').getTime();
      return dateB - dateA;
    });
  }

  // onContactUpdated(updatedContact: Contact): void {
  //   const index = this.contacts.findIndex(
  //     (contact) => contact.key === updatedContact.key
  //   );
  //   if (index !== -1) {
  //     this.contacts[index] = updatedContact;
  //     // Створюємо новий масив, щоб Angular відстежив зміни
  //     this.contacts = [...this.contacts];
  //     this.sortContacts();
  //   }
  // }

  // trackByContact(index: number, contact: ContactInterface): string {
  //   return contact.key ?? index.toString();
  // }
}
