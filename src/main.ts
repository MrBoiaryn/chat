import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
