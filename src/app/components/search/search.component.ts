import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageRepository } from '../../shared/classes/messageRepository';
// import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit, OnChanges {
  // @Input() messages: Array<{
  //   name: string;
  //   surname: string;
  //   message: string;
  //   time: string;
  // }> = [];
  @Input() searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  filteredMessages: Array<{
    name: string;
    surname: string;
    message: string;
    time: string;
  }> = [];

  searchQuery: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private messageRepository: MessageRepository // private httpService: HttpService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.searchMessages();
    // this.filterMessages();
  }

  // private loadAllMessages(): void {
  //   this.httpService.getContacts().subscribe((allPersons) => {
  //     this.allMessages = allPersons.flatMap((person) => {
  //       const messagesArray = person.messages
  //         ? Object.values(person.messages)
  //         : [];
  //       return messagesArray.map((msg: any) => ({
  //         name: person.name,
  //         surname: person.surname,
  //         message: msg.message,
  //         time: msg.time,
  //       }));
  //     });

  //     this.filterMessages();
  //   });
  // }

  // private filterMessages(): void {
  //   const term = this.searchTerm.toLowerCase();
  //   this.filteredMessages = this.allMessages
  //     .filter((msg) => msg.message.toLowerCase().includes(term))
  //     .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  // }

  highlightMatch(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return this.sanitizer.bypassSecurityTrustHtml(
      text.replace(regex, '<span class="highlight">$1</span>')
    );
  }

  searchMessages(): void {
    this.messageRepository.searchMessages(this.searchTerm);
    const term = this.searchTerm.toLowerCase();
    this.filteredMessages = this.messageRepository
      .searchMessages(this.searchTerm)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .map((msg) => ({
        name: msg.sender,
        surname: '',
        message: msg.message,
        time: msg.time,
      }));
  }

  onSearch(): void {
    this.searchEvent.emit(this.searchTerm);
  }
}
