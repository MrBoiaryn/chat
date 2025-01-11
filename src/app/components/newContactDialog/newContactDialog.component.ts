import { DialogModule } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Contact } from '../../shared/types/contact.interface';
import {
  DATABASE_REFERENCE,
  MessageRepository,
} from '../../shared/classes/messageRepository';
import { DatabaseReference, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-new-contact-dialog',
  imports: [FormsModule, DialogModule, MatDialogModule, CommonModule],
  templateUrl: './newContactDialog.component.html',
  styleUrl: './newContactDialog.component.scss',
  providers: [
    MessageRepository,
    {
      provide: DATABASE_REFERENCE,
      useFactory: (): DatabaseReference => {
        const db = getDatabase();
        return ref(db, 'contacts');
      },
    },
  ],
})
export class NewContactDialogComponent implements OnInit {
  name = '';
  surname = '';
  selectedGender: string = 'male';

  @Input() updateContacts!: () => void;

  constructor(
    private messageRepository: MessageRepository,
    private dialogRef: MatDialogRef<NewContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { refreshContacts: () => void }
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.name || !this.surname) {
      return;
    }

    const newPerson: Contact = {
      key: null,
      name: this.name,
      surname: this.surname,
      imgUrl: `../../../assets/images/icon/${this.generateRandomAvatarNumber(
        this.selectedGender
      )}.png`,
      lastMessage: '',
      time: new Date().toISOString(),
      messages: [],
    };

    this.messageRepository.addContact(newPerson);
    this.dialogRef.close();
  }

  private generateRandomAvatarNumber(gender: string): number {
    const maleAvatars = [1, 3, 5];
    const femaleAvatars = [2, 4, 6];
    const avatarNumbers = gender === 'male' ? maleAvatars : femaleAvatars;
    return avatarNumbers[Math.floor(Math.random() * avatarNumbers.length)];
  }
}
