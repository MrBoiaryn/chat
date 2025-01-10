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
  @Input() contacts: ContactInterface[] = [];
  @Input() isEditing: boolean = false;

  @Output() personSelected = new EventEmitter<ContactInterface>();
  selectedContact: ContactInterface | null = null;

  private previousContacts: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts'] && !changes['contacts'].firstChange) {
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
    this.loadContacts();
    this.sortContacts();
  }

  loadContacts(): void {
    this.httpService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.sortContacts();
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      },
    });
  }

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
    this.sortContacts();
  }

  deleteContact(contactKey: string): void {
    this.httpService.deleteContact(contactKey).subscribe({
      next: () => {
        this.loadContacts();
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
      return dateB - dateA;
    });
  }
}
