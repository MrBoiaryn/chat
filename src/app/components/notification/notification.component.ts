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
  @Input() name: string = '';
  @Input() surname: string = '';
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  closeNotification(): void {
    this.close.emit();
  }
}
