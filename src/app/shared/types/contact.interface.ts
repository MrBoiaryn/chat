import { MessageInterface } from './message.interface';

export class Contact {
  constructor(
    public key: string | null,
    public name: string,
    public surname: string,
    public imgUrl: string,
    public lastMessage: string,
    public time: string,
    public messages: Array<MessageInterface>
  ) {}
}
