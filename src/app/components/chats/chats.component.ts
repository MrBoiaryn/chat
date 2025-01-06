import { Component, EventEmitter, Output } from '@angular/core';
import { personsData } from '../../shared/data/datainfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  imports: [CommonModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {
  @Output() personSelected = new EventEmitter<any>();
  persons = personsData;
  selectedPerson: any = null;

  get personsArray() {
    return Object.values(this.persons);
  }

  selectPerson(person: any) {
    this.selectedPerson = person;
    this.personSelected.emit(person);
  }
}
