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
import { personsData } from '../../shared/data/datainfo';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';
import { MaxlengthPipe } from '../../shared/pipes/maxlength.pipe';
import { ContactInterface } from '../../shared/types/contact.interface';

@Component({
  selector: 'app-chats',
  imports: [CommonModule, MaxlengthPipe],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit, OnChanges, DoCheck {
  // @Output() personSelected = new EventEmitter<any>();
  // @Output() contactsUpdated = new EventEmitter<void>();
  @Input() contacts: ContactInterface[] = [];
  @Input() isEditing: boolean = false; // Отримуємо стан редагування

  @Output() personSelected = new EventEmitter<ContactInterface>();
  // contacts: ContactInterface[] = [];
  selectedContact: ContactInterface | null = null; // Додано змінну

  private previousContacts: string = '';

  // contacts: ContactInterface[] = [];
  // selectedContact: any = null;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts'] && !changes['contacts'].firstChange) {
      console.log('Contacts updated-----:', this.contacts);
      this.sortContacts();
    }
  }

  ngDoCheck(): void {
    const currentContacts = JSON.stringify(this.contacts);
    if (currentContacts !== this.previousContacts) {
      this.previousContacts = currentContacts;
      this.sortContacts();
    }
  }

  refreshContacts(): void {
    this.loadContacts(); // Метод, який завантажує список контактів
    this.sortContacts();
  }

  // Load contacts from Firebase
  loadContacts(): void {
    this.httpService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.sortContacts(); // Сортуємо контакти після завантаження
        console.log('Contacts loaded:', this.contacts);
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      },
    });
  }

  // Select a contact to open chat
  selectPerson(contact: ContactInterface): void {
    if (this.selectedContact === contact) return;
    if (this.isEditing) {
      alert('You cannot switch chats while editing.');
      return;
    }
    this.selectedContact = contact;
    this.sortContacts();
    this.personSelected.emit(contact);
  }

  onContactDeleted(contactKey: string): void {
    this.contacts = this.contacts.filter(
      (contact) => contact.key !== contactKey
    );
    this.sortContacts(); // Оновлюємо сортування після видалення контакту
  }

  // Delete a contact
  deleteContact(contactKey: string): void {
    this.httpService.deleteContact(contactKey).subscribe({
      next: () => {
        console.log('Contact deleted:', contactKey);
        this.loadContacts(); // Refresh contacts after deletion
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
      },
    });
  }

  private sortContacts(): void {
    this.contacts.sort((a, b) => {
      const dateA = new Date(a.time || '').getTime();
      const dateB = new Date(b.time || '').getTime();
      return dateB - dateA; // Сортуємо за спаданням дати
    });
  }
}
