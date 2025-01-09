import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../shared/services/http.service';
import { DialogModule } from '@angular/cdk/dialog';
import { NewContactDialogComponent } from '../newContactDialog/newContactDialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from '../chats/chats.component';

@Component({
  selector: 'app-header',
  imports: [
    FontAwesomeModule,
    MatIconModule,
    DialogModule,
    MatDialogModule,
    FormsModule,
    SearchComponent,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  myName!: string;
  mySurname!: string;
  myImgUrl!: string;
  searchTerm: string = ''; // Текст пошуку
  allMessages: Array<{
    name: string;
    surname: string;
    message: string;
    time: string;
  }> = []; // Всі повідомлення

  @Input() refreshContacts!: () => void;

  @Output() chatSelected = new EventEmitter<string>(); // Подія для передачі вибору чату

  constructor(private httpService: HttpService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadMyData();
    this.loadAllMessages();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewContactDialogComponent, {
      data: {
        refreshContacts: this.refreshContacts,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Dialog result: ${result}`);
      }
    });
  }

  selectChat(chatName: string) {
    this.chatSelected.emit(chatName); // Емітуємо подію у батьківський компонент
  }

  private loadMyData() {
    this.httpService.getMyData().subscribe((data) => {
      this.myName = data.name;
      this.myImgUrl = data.imgUrl;
      this.mySurname = data.surname || '';
    });
  }

  private loadAllMessages() {
    this.httpService.getContacts().subscribe((allPersons) => {
      this.allMessages = allPersons.flatMap((person: any) => {
        // Перевіряємо, чи є messages масивом
        const messages = Array.isArray(person.messages) ? person.messages : [];
        return messages.map((msg: any) => ({
          name: person.name,
          surname: person.surname,
          message: msg.message,
          time: msg.time,
        }));
      });
    });
  }
}
