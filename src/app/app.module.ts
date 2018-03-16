import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';

import { ProducerPage } from '../pages/producer/producer';
import { MonitorPage } from '../pages/monitor/monitor';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';


var config = {
  apiKey: "AIzaSyAJSoAitZRbeI4oem3RR1Nd2ymBuJAWWos",
  authDomain: "salt-unicef-db-677ff.firebaseapp.com",
  databaseURL: "https://salt-unicef-db-677ff.firebaseio.com",
  projectId: "salt-unicef-db-677ff",
  storageBucket: "salt-unicef-db-677ff.appspot.com",
  messagingSenderId: "783683067533"
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
    AngularFireModule.initializeApp(config),
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast
  ]
})
export class AppModule {}
