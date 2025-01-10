import { DialogModule } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpService } from '../../shared/services/http.service';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../shared/types/contact.interface';

@Component({
  selector: 'app-new-contact-dialog',
  imports: [FormsModule, DialogModule, MatDialogModule, CommonModule],
  templateUrl: './newContactDialog.component.html',
  styleUrl: './newContactDialog.component.scss',
})
export class NewContactDialogComponent implements OnInit {
  name = '';
  surname = '';
  selectedGender: string = 'male';

  @Input() updateContacts!: () => void;

  constructor(
    private httpService: HttpService,
    private dialogRef: MatDialogRef<NewContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { refreshContacts: () => void }
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.name || !this.surname) {
      return;
    }

    const newPerson: ContactInterface = {
      name: this.name,
      surname: this.surname,
      imgUrl: `../../../assets/images/icon/${this.generateRandomAvatarNumber(
        this.selectedGender
      )}.png`,
      lastMessage: '',
      time: new Date().toISOString(),
      messages: [],
    };

    this.httpService.createContact(newPerson).subscribe({
      next: () => {
        this.data.refreshContacts();
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Error creating contact:', err);
      },
    });
  }

  private generateRandomAvatarNumber(gender: string): number {
    const maleAvatars = [1, 3, 5];
    const femaleAvatars = [2, 4, 6];
    const avatarNumbers = gender === 'male' ? maleAvatars : femaleAvatars;
    return avatarNumbers[Math.floor(Math.random() * avatarNumbers.length)];
  }
}
