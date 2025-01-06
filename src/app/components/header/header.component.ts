import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { AndriiBoiyarin } from '../../shared/data/datainfo';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  myName = AndriiBoiyarin.name;
  myImgUrl = AndriiBoiyarin.imgUrl;
}
