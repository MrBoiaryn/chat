import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MaxlengthPipeNotification } from '../../shared/pipes/maxlengthnotification.pipe';

@Component({
  selector: 'app-notification',
  imports: [MatIcon, CommonModule, MaxlengthPipeNotification],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @Input() name: string = ''; // Ім'я відправника
  @Input() surname: string = ''; // Прізвище відправника
  @Input() message: string = ''; // Повідомлення
  @Output() close = new EventEmitter<void>(); // Подія для закриття нотифікації

  closeNotification() {
    this.close.emit(); // Відправляємо подію закриття
  }
}
