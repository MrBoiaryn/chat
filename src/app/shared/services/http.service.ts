import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concat,
  delay,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { personsData } from '../data/datainfo';
import { ContactInterface } from '../types/contact.interface';
import { RequestContactInterface } from '../types/request-contact.interface';
import { ResponseContactInterface } from '../types/response-contact.interface';
import { MessageInterface } from '../types/message.interface';
// import myData from '../data/myData.json';

const BASE_URL =
  'https://chat-boiaryn-default-rtdb.europe-west1.firebasedatabase.app/';

const QUOTE_API_URL = 'https://programming-quotesapi.vercel.app/api/random';

// const myUrl = 'assets/data/myData.json';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private myUrl = 'assets/data/mydata.json';

  constructor(private http: HttpClient) {}

  // Get all contacts
  getContacts(): Observable<ContactInterface[]> {
    return this.http
      .get<{ [key: string]: ContactInterface }>(`${BASE_URL}contacts.json`)
      .pipe(
        map((response) => {
          const contactsArray: ContactInterface[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              contactsArray.push({ key, ...response[key] });
            }
          }
          return contactsArray;
        }),
        catchError((err) => {
          console.error('Error fetching contacts:', err);
          return of([]);
        })
      );
  }

  // Create a new contact
  createContact(contact: ContactInterface): Observable<ContactInterface> {
    return this.http
      .post<{ name: string }>(`${BASE_URL}contacts.json`, contact)
      .pipe(
        map((response) => {
          return { ...contact, key: response.name };
        }),
        catchError((err) => {
          console.error('Error creating contact:', err);
          return of(contact);
        })
      );
  }

  // Update a contact's information
  // updateContact(key: string, contact: ContactInterface): Observable<void> {
  //   return this.http.put<void>(`${BASE_URL}contacts/${key}.json`, contact).pipe(
  //     catchError((err) => {
  //       console.error('Error updating contact:', err);
  //       return of();
  //     })
  //   );
  // }

  updateContact(
    key: string,
    contact: Partial<ContactInterface>
  ): Observable<void> {
    return this.http
      .patch<void>(`${BASE_URL}contacts/${key}.json`, contact)
      .pipe(
        catchError((err) => {
          console.error('Error updating contact:', err);
          return of();
        })
      );
  }

  // Delete a contact
  // Delete a contact
  deleteContact(key: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}contacts/${key}.json`).pipe(
      tap(() => console.log(`Contact ${key} deleted`)),
      catchError((err) => {
        console.error('Error deleting contact:', err);
        return of();
      })
    );
  }

  // Add a message to a specific contact
  addMessageToContact(
    contactKey: string,
    newMessage: MessageInterface
  ): Observable<{ name: string }> {
    return this.http
      .post<{ name: string }>(
        `${BASE_URL}contacts/${contactKey}/messages.json`,
        newMessage
      )
      .pipe(
        catchError((err) => {
          console.error('Error adding message:', err);
          return of({ name: '' });
        })
      );
  }

  getBotResponse(
    contactKey: string,
    name: string,
    surname: string
  ): Observable<MessageInterface> {
    return this.http
      .get<{ author: string; quote: string }>(
        'https://programming-quotesapi.vercel.app/api/random'
      )
      .pipe(
        map((response) => {
          return {
            message: `${response.quote}`,
            time: new Date().toISOString(),
            sender: `${name} ${surname}`.trim(), // Використовуємо ім'я та прізвище
          };
        }),
        catchError((err) => {
          console.error('Error getting bot response:', err);
          return of({
            message: 'Sorry, something went wrong.',
            time: new Date().toISOString(),
            sender: `${name} ${surname}`.trim(),
          });
        })
      );
  }

  // Get messages for a specific contact
  getMessages(key: string): Observable<MessageInterface[]> {
    return this.http
      .get<{ [key: string]: MessageInterface }>(
        `${BASE_URL}contacts/${key}/messages.json`
      )
      .pipe(
        map((response) => {
          if (!response) return [];
          return Object.values(response);
        }),
        catchError((err) => {
          console.error('Error fetching messages:', err);
          return of([]);
        })
      );
  }

  getMyData(): Observable<any> {
    return this.http.get<any>(this.myUrl);
  }

  updateMessage(
    contactKey: string,
    messageKey: string,
    updatedMessage: MessageInterface
  ): Observable<void> {
    if (!contactKey || !messageKey) {
      console.error('Invalid contactKey or messageKey');
      return of();
    }

    const url = `${BASE_URL}contacts/${contactKey}/messages/${messageKey}.json`;

    return this.http.put<void>(url, updatedMessage).pipe(
      catchError((err) => {
        console.error(`Error updating message with key ${messageKey}:`, err);
        return of();
      })
    );
  }
}
