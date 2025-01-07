import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MaxlengthPipeNotification } from '../../shared/pipes/maxlengthnotification.pipe';

@Component({
  selector: 'app-notification',
  imports: [MatIcon, CommonModule, MaxlengthPipeNotification],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  name: string | undefined;
  surname: string | undefined;
  lastMessage: string | undefined;

  message: string =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit aliquam voluptates ea laboriosam quae perferendis soluta fuga. Necessitatibus maxime labore, reprehenderit nam quos, inventore quod dignissimos magnam ex possimus cum.';

  closeNotification() {}
}
