import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageRepository } from '../../shared/classes/messageRepository';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnChanges {
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
    private messageRepository: MessageRepository
  ) {}

  ngOnChanges(): void {
    this.searchMessages();
  }

  highlightMatch(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return this.sanitizer.bypassSecurityTrustHtml(
      text.replace(regex, '<span class="highlight">$1</span>')
    );
  }

  searchMessages(): void {
    this.messageRepository.searchMessages(this.searchTerm);
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
