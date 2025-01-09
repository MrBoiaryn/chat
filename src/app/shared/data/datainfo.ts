import { ContactInterface } from '../types/contact.interface';

export const AndriiBoiyarin = {
  name: 'Andrii Boiaryn',
  imgUrl: '../../../assets/images/icon/3.png',
};

export const personsData: ContactInterface = {
  name: 'Alice',
  surname: 'Freeman',
  imgUrl: '../../../assets/images/icon/2.png',
  lastMessage: 'How was your meeting?',
  time: '1736108866000',
  messages: [
    {
      message: 'Hi! How are you?',
      time: '1736008866000',
      sender: 'AliceFreeman',
    },
    {
      message: 'How was your meeting?',
      time: '1735108866000',
      sender: 'AliceFreeman',
    },
    {
      message: 'Hi! I am fine, thank you!',
      time: '1736004866000',
      sender: 'AndriiBoiyarin',
    },
  ],
};
