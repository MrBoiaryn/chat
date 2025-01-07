import { DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../../shared/services/http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-contact-dialog',
  imports: [FormsModule, DialogModule, MatDialogModule, CommonModule],
  templateUrl: './newContactDialog.component.html',
  styleUrl: './newContactDialog.component.scss',
})
export class NewContactDialogComponent {
  name = '';
  surname = '';
  selectedGender: string = 'male';

  constructor(
    private httpService: HttpService,
    private dialogRef: MatDialogRef<NewContactDialogComponent>
  ) {}

  onSubmit() {
    const randomAvatarNumber = this.generateRandomAvatarNumber(
      this.selectedGender
    );
    const newPerson = {
      name: this.name,
      surname: this.surname,
      imgUrl: `../../../assets/images/icon/${randomAvatarNumber}.png`,
      lastMessage: '',
      time: new Date().toISOString(),
      message: [],
    };

    this.httpService.createPerson(newPerson);
    this.dialogRef.close(); // Закриваємо діалогове вікно
  }

  private generateRandomAvatarNumber(gender: string): number {
    const maleAvatars = [1, 3, 5];
    const femaleAvatars = [2, 4, 6];

    const avatarNumbers = gender === 'male' ? maleAvatars : femaleAvatars;
    const randomIndex = Math.floor(Math.random() * avatarNumbers.length);

    return avatarNumbers[randomIndex];
  }
}
