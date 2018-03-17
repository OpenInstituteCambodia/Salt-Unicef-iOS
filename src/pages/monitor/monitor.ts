import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';

// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabase } from 'angularfire2/database';
// // import * as firebase from 'firebase/app';
// //import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {
  //email: string;
  monitorID: number=0;
  producerID: number=0;
  measurementDate: string ="";
  isAtProducer: number=0;
  location: string ="";
  measurement: number=0;
  warningOrNot: number=0;
  followUpDate: string ="";

  constructor(private alertCtrl:AlertController, private toast: Toast,
    // private fire: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private app: App, private sqlite: SQLite) 
  {
    //this.email = fire.auth.currentUser.email;
    console.log(this.navParams);
    // this.producer_id = this.navParams.get('producer_id');
    this.monitorID = this.navParams.get('monitorID');
    this.producerID = this.navParams.get('producerID');
    this.measurementDate = this.navParams.get('measurementDate');
    this.isAtProducer = this.navParams.get('isAtProducer');
    this.location = this.navParams.get('location');
    this.measurement = this.navParams.get('measurement');
    this.warningOrNot = this.navParams.get('warningOrNot');
    this.followUpDate = this.navParams.get('followUpDate');

    platform.ready().then(() => {
      //Registration of push in Android and Windows Phone
      platform.registerBackButtonAction(() => {
          let nav = this.app.getActiveNav();
          console.log('Back is click')
          if (nav.canGoBack()){ //Can we go back?
              nav.popToRoot();
          }else{
              this.platform.exitApp(); //Exit from app
          }
      });
  });


  }
  
  createTableMonitor(){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('CREATE TABLE IF NOT EXISTS monitorTable (id INTEGER PRIMARY KEY, monitorID TEXT, producerID TEXT, measurementDate TEXT, isAtProducer INT, location TEXT, measurement INT,warningOrNot INT,followUpDate TEXT)', {})
      .then( res => console.log('execuated SQL!'))
      .catch(e => console.log(e));
    })
  }
  // creating alert dialog
  alert(message: string)
  {
    this.alertCtrl.create({
      title: 'Info',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  saveMonitorData()
  {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql(' INSERT INTO monitorTable (monitorID, producerID, measurementDate, isAtProducer, location, measurement, warningOrNot,followUpDate) VALUES(?,?,?,?,?,?,?,?)', [this.monitorID, this.producerID,this.measurementDate, this.isAtProducer,this.location,this.measurement, this.warningOrNot, this.followUpDate])
      .then( res => {
        console.log('Data Inserted !');
        this.toast.show('Monitor Data has been saved!', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      })
      .catch(e => console.log(e));
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorPage');
    this.createTableMonitor();
  }

}