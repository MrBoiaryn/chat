import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { personsData } from '../../shared/data/datainfo';

@Component({
  selector: 'app-chat',
  imports: [MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  chats = personsData;
  @Input() name: string | undefined;
  @Input() imgUrl: string | undefined;
}
