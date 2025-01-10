import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../shared/services/http.service';
import { DialogModule } from '@angular/cdk/dialog';
import { NewContactDialogComponent } from '../newContactDialog/newContactDialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';

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
  searchTerm: string = '';
  allMessages: Array<{
    name: string;
    surname: string;
    message: string;
    time: string;
  }> = [];

  @Input() refreshContacts!: () => void;

  @Output() chatSelected = new EventEmitter<string>();
  @Output() searchEvent = new EventEmitter<string>();

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
      }
    });
  }

  selectChat(chatName: string) {
    this.chatSelected.emit(chatName);
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
      this.allMessages = allPersons.flatMap((person) => {
        if (!Array.isArray(person.messages)) {
          return [];
        }
        return person.messages.map((msg) => ({
          name: person.name,
          surname: person.surname,
          message: msg.message,
          time: msg.time,
        }));
      });
    });
  }

  onSearch(): void {
    this.searchEvent.emit(this.searchTerm);
  }
}
