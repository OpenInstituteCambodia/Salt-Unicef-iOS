import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ProducerPage } from '../pages/producer/producer';
import { MonitorPage } from '../pages/monitor/monitor';
// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';


// Initialize Firebase
const firebaseAuth = {
  apiKey: "AIzaSyACf7ik6RsscUMQZbaOfhyKqclKpnpsJjY",
  authDomain: "salt-57e1d.firebaseapp.com",
  databaseURL: "https://salt-57e1d.firebaseio.com",
  projectId: "salt-57e1d",
  storageBucket: "salt-57e1d.appspot.com",
  messagingSenderId: "674607225137"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProducerPage,
    MonitorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    // AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth feature
    AngularFireDatabaseModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProducerPage,
    MonitorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
