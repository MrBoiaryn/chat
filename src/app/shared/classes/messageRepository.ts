import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  child,
  DatabaseReference,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../types/contact.interface';
import { MessageInterface } from '../types/message.interface';

export const DATABASE_REFERENCE = new InjectionToken<DatabaseReference>(
  'firebase.database.ref'
);

@Injectable({
  providedIn: 'root',
})
export class MessageRepository {
  private contact: Map<string, Contact> = new Map();
  public contactUpdated$: BehaviorSubject<Contact | null> =
    new BehaviorSubject<Contact | null>(null);

  constructor(@Inject(DATABASE_REFERENCE) private myRef: DatabaseReference) {
    onChildAdded(this.myRef, (snapshot) => {
      const newChild = snapshot.val();
      const key = snapshot.key;
      if (key && newChild) {
        const newContact: Contact = this.createContact(key, newChild);
        this.contact.set(key, newContact);
        this.contactUpdated$.next(newContact);
      }
    });

    onChildChanged(this.myRef, (snapshot) => {
      const changedChild = snapshot.val();
      const key = snapshot.key;

      if (key && changedChild) {
        const updatedContact: Contact = this.createContact(key, changedChild);
        this.contact.set(key, updatedContact);
        this.contactUpdated$.next(updatedContact);
      }
    });

    onChildRemoved(this.myRef, (snapshot) => {
      const key = snapshot.key;
      if (key) {
        this.contact.delete(key);
      }
    });
  }

  private createContact(key: string, newChild: any): Contact {
    return new Contact(
      key,
      newChild.name,
      newChild.surname,
      newChild.imgUrl,
      newChild.lastMessage,
      newChild.time,
      newChild.messages == null
        ? []
        : Object.keys(newChild.messages).map((key) => {
            const message = newChild.messages[key];
            message.key = key;
            return message;
          })
    );
  }

  sendMessage(contactKey: string, message: string, sender?: string): void {
    const contact = this.contact.get(contactKey);

    if (contact) {
      const messagesRef = ref(getDatabase(), `contacts/${contactKey}/messages`);
      const newMessageRef = push(messagesRef);
      const newMessage: MessageInterface = {
        message: message,
        time: new Date().toISOString(),
        sender: sender ?? 'User',
        key: newMessageRef.key!,
      };
      let messages = Object.values(contact.messages);
      messages.push(newMessage);
      contact.messages = messages;
      contact.lastMessage = message;
      contact.time = newMessage.time;

      this.contact.set(contactKey, contact);
      this.contactUpdated$.next(contact);

      set(newMessageRef, newMessage);
      update(child(this.myRef, contactKey), contact);
    }
  }

  editMessage(contactKey: string, messageKey: string, message: string): void {
    const contact = this.contact.get(contactKey);
    if (contact) {
      let messages = Object.values(contact.messages);
      const index = messages.findIndex((msg) => msg.key === messageKey);
      if (index !== -1) {
        messages[index] = {
          ...messages[index],
          message: message,
          time: new Date().toISOString(),
        };

        contact.messages = messages;
        this.contact.set(contactKey, contact);
        this.contactUpdated$.next(contact);
        update(child(this.myRef, contactKey), contact);
      }
    }
  }

  updateContact(contactKey: string, contact: Contact): void {
    this.contact.set(contactKey, contact);
    this.contactUpdated$.next(contact);
    update(child(this.myRef, contactKey), contact);
  }

  getContact(contactKey: string): Contact | undefined {
    return this.contact.get(contactKey);
  }

  deleteContact(contactKey: string): void {
    this.contact.delete(contactKey);
    remove(child(this.myRef, contactKey));
  }

  addContact(contact: Contact): void {
    const dbRef = push(this.myRef);
    contact.key = dbRef.key;
    update(dbRef, contact);
    this.contact.set(dbRef.key!, contact);
    this.contactUpdated$.next(contact);
  }

  searchMessages(searchTerm: string): MessageInterface[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const results: MessageInterface[] = [];
    this.contact.forEach((contact) => {
      if (contact.messages) {
        contact.messages.forEach((message) => {
          if (
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push(message);
          }
        });
      }
    });
    return results;
  }
}
