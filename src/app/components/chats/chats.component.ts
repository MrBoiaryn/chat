import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Input() isEditing: boolean = false;

  @Output() personSelected = new EventEmitter<Contact>();
  selectedContact: Contact | null = null;

  constructor(private messageRepository: MessageRepository) {}

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnChanges(): void {
    this.sortContacts();
  }

  subscribe(): void {
    this.messageRepository.contactUpdated$.subscribe((contact) => {
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

    this.selectedContact = contact;
    this.personSelected.emit(contact);
  }

  onContactDeleted(): void {
    this.contacts = this.contacts.filter((contact) => {
      return contact.key !== contact.key;
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
