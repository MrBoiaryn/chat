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
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Contact } from '../types/contact.interface';
import { MessageInterface } from '../types/message.interface';

export const DATABASE_REFERENCE = new InjectionToken<DatabaseReference>(
  'firebase.database.ref'
);

@Injectable({
  providedIn: 'root', // Make this a service, Injectable at root level
})
export class MessageRepository {
  private contact: Map<string, Contact> = new Map();
  public contactUpdated$: BehaviorSubject<Contact | null> =
    new BehaviorSubject<Contact | null>(null); // Use an RxJS Subject

  constructor(@Inject(DATABASE_REFERENCE) private myRef: DatabaseReference) {
    onChildAdded(this.myRef, (snapshot) => {
      const newChild = snapshot.val();
      const key = snapshot.key;
      if (key && newChild) {
        const newContact: Contact = new Contact(
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
        this.contact.set(key, newContact);
        this.contactUpdated$.next(newContact); // Emit the new contact
      }
    });

    onChildChanged(this.myRef, (snapshot) => {
      const changedChild = snapshot.val();
      const key = snapshot.key;

      if (key && changedChild) {
        const updatedContact: Contact = { ...changedChild, key };
        this.contact.set(key, updatedContact);
        this.contactUpdated$.next(updatedContact); // Emit the updated contact
      }
    });

    onChildRemoved(this.myRef, (snapshot) => {
      const key = snapshot.key;
      if (key) {
        const removedContact = this.contact.get(key);
        this.contact.delete(key);

        if (removedContact) {
          // It's generally not recommended to emit removed items via next
          // Instead, components can just filter out the deleted item when it is not present
          //  in the map after a removal.  That way, components already know the item is deleted.
          // this.contactUpdated$.next(removedContact); // For informational purposes if needed
        }

        // console.log('Child removed:', key);
      }
    });
  }

  // Method to get all contacts as an observable
  // getMessages(contactKey: string): MessageInterface[] {
  //   return this.contact.get(contactKey)?.messages || [];
  // }

  sendMessage(contactKey: string, message: string, sender?: string): void {
    const contact = this.contact.get(contactKey);
    const newMessage: MessageInterface = {
      message: message,
      time: new Date().toISOString(),
      sender: sender ?? 'User',
    };
    if (contact) {
      let messages = contact.messages || [];
      messages.push(newMessage);
      contact.messages = messages;
      this.contact.set(contactKey, contact);
      this.contactUpdated$.next(contact);
      update(child(this.myRef, contactKey), contact);
    }
  }

  editMessage(
    contactKey: string,
    messageKey: string,
    message: MessageInterface
  ): void {
    const contact = this.contact.get(contactKey);
    if (contact) {
      let messages = contact.messages || [];
      const index = messages.findIndex((msg) => msg.key === messageKey);
      if (index !== -1) {
        messages[index] = message;
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
    if (!searchTerm) {
      return []; // Return empty array if search term is empty
    }

    const results: MessageInterface[] = [];
    this.contact.forEach((contact) => {
      if (contact.messages) {
        contact.messages.forEach((message) => {
          if (
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            // Case-insensitive search
            results.push(message);
          }
        });
      }
    });
    return results; // Emit the results as an Observable
  }

  // ... any other methods for your repository (getContact, etc.)
}
