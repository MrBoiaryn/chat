import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  encapsulation: ViewEncapsulation.None, // Вимикає ізоляцію стилів
})
export class SearchComponent {
  @Input() messages: Array<{
    name: string;
    surname: string;
    message: string;
    time: string;
  }> = [];
  @Input() searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  searchQuery: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  get filteredMessages() {
    const term = this.searchTerm.toLowerCase();
    return this.messages
      .filter((msg) => msg.message.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  highlightMatch(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return this.sanitizer.bypassSecurityTrustHtml(
      text.replace(regex, '<span class="highlight">$1</span>')
    );
  }

  onSearch(): void {
    this.searchEvent.emit(this.searchQuery);
  }
}
