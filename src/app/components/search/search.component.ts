import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
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

  constructor(private sanitizer: DomSanitizer) {}

  get filteredMessages() {
    const term = this.searchTerm.toLowerCase();

    // Фільтрація повідомлень за пошуковим запитом
    const filtered = this.messages.filter((msg) =>
      msg.message.toLowerCase().includes(term)
    );

    // Сортування повідомлень за датою (нові зверху)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      return dateB - dateA; // Нові зверху
    });
  }

  highlightMatch(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlightedText = text.replace(
      regex,
      '<span class="highlight">$1</span>'
    );

    console.log('Highlighted text:', highlightedText); // Перевірка в консолі

    // Очищуємо HTML через DomSanitizer
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}
