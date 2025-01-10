import { MessageInterface } from './message.interface';

export interface ContactInterface {
  key?: string | null;
  name: string;
  surname: string;
  imgUrl: string;
  lastMessage: string;
  time: string;
  messages?: Array<MessageInterface>;
}
