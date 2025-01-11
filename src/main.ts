import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB01DGhm3_gGNU4sxJ-LxwLdQSmZEvyDQw',
  authDomain: 'chat-boiaryn.firebaseapp.com',
  databaseURL:
    'https://chat-boiaryn-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'chat-boiaryn',
  storageBucket: 'chat-boiaryn.firebasestorage.app',
  messagingSenderId: '10552795282',
  appId: '1:10552795282:web:e7dc90aff18f7e39fc464b',
};

initializeApp(firebaseConfig);
