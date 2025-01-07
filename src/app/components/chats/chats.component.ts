import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { personsData } from '../../shared/data/datainfo';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';
import { MaxlengthPipe } from '../../shared/pipes/maxlength.pipe';

@Component({
  selector: 'app-chats',
  imports: [CommonModule, MaxlengthPipe],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  @Output() personSelected = new EventEmitter<any>();
  persons: any[] = [];
  selectedPerson: any = null;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getPersonsData().subscribe((data: any[]) => {
      console.log('Persons data updated:', data);
      this.persons = data;
    });
  }

  get personsArray() {
    return this.persons;
  }

  selectPerson(person: any) {
    this.selectedPerson = person;
    this.personSelected.emit(person);
  }
}
