import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
// import { HttpService } from '../../shared/services/http.service';
import { DialogModule } from '@angular/cdk/dialog';
import { NewContactDialogComponent } from '../newContactDialog/newContactDialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { AndriiBoiyarin } from '../../shared/data/datainfo';
import { MessageRepository } from '../../shared/classes/messageRepository';

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

  constructor(
    // private httpService: HttpService,
    private messageRepository: MessageRepository,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMyData();
    // this.loadAllMessages();
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
    this.myName = AndriiBoiyarin.name;
    this.myImgUrl = AndriiBoiyarin.imgUrl;
    this.mySurname = AndriiBoiyarin.surname;
  }

  // searchMessages(): void {
  //   this.messageRepository.searchMessages(this.searchTerm);
  // }

  // onSearch(): void {
  //   this.searchEvent.emit(this.searchTerm);
  // }
}
