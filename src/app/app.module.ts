import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ProducerPage } from '../pages/producer/producer';
import { MonitorPage } from '../pages/monitor/monitor';
import { HomePage } from '../pages/home/home';
// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { HttpModule, Http} from '@angular/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Initialize Firebase -- phyrum 
const config = {
  apiKey: "AIzaSyACf7ik6RsscUMQZbaOfhyKqclKpnpsJjY",
  authDomain: "salt-57e1d.firebaseapp.com",
  databaseURL: "https://salt-57e1d.firebaseio.com",
  projectId: "salt-57e1d",
  storageBucket: "salt-57e1d.appspot.com",
  messagingSenderId: "674607225137"
};

// --- samak firebase connection -----
// var config = {
//   apiKey: "AIzaSyAJSoAitZRbeI4oem3RR1Nd2ymBuJAWWos",
//   authDomain: "salt-unicef-db-677ff.firebaseapp.com",
//   databaseURL: "https://salt-unicef-db-677ff.firebaseio.com",
//   projectId: "salt-unicef-db-677ff",
//   storageBucket: "salt-unicef-db-677ff.appspot.com",
//   messagingSenderId: "783683067533"
// };

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProducerPage,
    MonitorPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    // AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth feature
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProducerPage,
    MonitorPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    AuthServiceProvider,
    Network
  ]
})
export class AppModule {}
