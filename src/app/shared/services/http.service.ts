import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private dataUrl = 'assets/data/datapersons.json';
  private myUrl = 'assets/data/mydata.json';
  private personsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.http
      .get<any>(this.dataUrl)
      .pipe(map((data) => Object.values(data)))
      .subscribe((persons) => {
        this.personsSubject.next(persons);
      });
  }

  getMyData(): Observable<any> {
    return this.http.get<any>(this.myUrl);
  }

  createPerson(person: any): void {
    console.log('Adding person:', person);
    const currentPersons = this.personsSubject.value;
    this.personsSubject.next([...currentPersons, person]);
  }

  getPersonsData(): Observable<any[]> {
    return this.personsSubject.asObservable();
  }

  updatePerson(updatedPerson: any): void {
    const currentPersons = this.personsSubject.value;

    const updatedPersons = currentPersons.map((person) =>
      person.name === updatedPerson.originalName
        ? { ...person, ...updatedPerson }
        : person
    );

    this.personsSubject.next(updatedPersons);
  }

  deletePerson(name: string): void {
    const currentPersons = this.personsSubject.value;
    const filteredPersons = currentPersons.filter(
      (person) => person.name !== name
    );
    this.personsSubject.next(filteredPersons);
  }

  addMessageToPerson(name: string, newMessage: any): void {
    const currentPersons = this.personsSubject.value;

    const updatedPersons = currentPersons.map((person) => {
      if (person.name === name) {
        return {
          ...person,
          message: [...person.message, newMessage], // Додаємо нове повідомлення
          lastMessage: newMessage.message, // Оновлюємо останнє повідомлення
          time: newMessage.time, // Оновлюємо час останнього повідомлення
        };
      }
      return person;
    });

    this.personsSubject.next(updatedPersons);
  }

  getCurrentPersons(): any[] {
    return this.personsSubject.value;
  }

  // getRandomQuote(): Observable<string> {
  //   const url = 'http://api.quotable.io/random';
  //   return this.http
  //     .get<any>(url)
  //     .pipe(
  //       map((response) => response.content || 'I am here to chat with you!')
  //     );
  // }
  getRandomQuote(): Observable<string> {
    const url = 'https://programming-quotesapi.vercel.app/api/random';
    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response && response.quote) {
          return response.quote; // Extract quote from the new property
        } else {
          console.error('Unexpected response structure from API:', response);
          return 'An unknown error occurred while retrieving the quote.';
        }
      }),
      catchError((error) => {
        console.error('There was an error getting the quote:', error);
        return of(
          'An error occurred while receiving the quote. Please try again later.'
        );
      })
    );
  }
}
