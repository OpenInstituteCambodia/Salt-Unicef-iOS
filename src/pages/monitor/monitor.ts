import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Toast } from '@ionic-native/toast';

/**
 * Generated class for the MonitorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {
  //email: string;
  monitorID: string ="";
  producerID: string ="";
  measurementDate: string ="";
  producerOrNot: string ="";
  location: string ="";
  measurement: string ="";
  warningOrNot: string ="";
  followUpDate: string ="";

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private app: App) 
  {
    //this.email = fire.auth.currentUser.email;
    console.log(this.navParams);
    // this.producer_id = this.navParams.get('producer_id');
    this.monitorID = this.navParams.get('monitorID');
    this.producerID = this.navParams.get('producerID');
    this.measurementDate = this.navParams.get('measurementDate');
    this.producerOrNot = this.navParams.get('producerOrNot');
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
    this.db.list('/monitorTbl').push({
      monitorID: this.monitorID,
      producerID: this.producerID,
      measurementDate: this.measurementDate,
      producerOrNot: this.producerOrNot,
      location: this.location,
      measurement: this.measurement,
      warningOrNot: this.warningOrNot,
      followUpDate: this.followUpDate
    })
    .then(() => {
      // save data
      this.alert("Successfully Saved");
      this.navCtrl.push(MonitorPage);
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorPage');
    this.createTable();
  }

  createTable(){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('CREATE TABLE IF NOT EXISTS monitorTable (id INTEGER PRIMARY KEY, followUpDate TEXT, location TEXT, measurement INT, measurementDate TEXT, monitorID INT, producerID INT, isProducer INT,isWarning INT)', {})
      .then( res => console.log('execuated SQL'))
      .catch(e => console.log(e));
    })
  }

  saveMeasurementMonitor(){
    this.toast.show('Button Clicked !', '5000', 'center').subscribe(
      toast => {
        this.navCtrl.popToRoot();
      }
    );
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql(' INSERT INTO producerTable (producerName, measurementDate, potassiumInStock, potassiumUsedToday, saltProducedToday, measurment1, measurment2,measurment3,measurment4,measurment5,measurment6,measurment7, measurment8) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.producerName, this.MeasurementDate,this.potassiumInStock, this.potassiumUsedToday,this.saltProducedToday,this.measurement1, this.measurement2, this.measurement3, this.measurement4, this.measurement5, this.measurement6, this.measurement7, this.measurement8])
      .then( res => {
        console.log('Data Inserted !');
        this.toast.show('Data saved', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      })
      .catch(e => console.log(e));
    })
  }

}
