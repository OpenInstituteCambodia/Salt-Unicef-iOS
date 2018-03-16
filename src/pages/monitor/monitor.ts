import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toast: Toast) {
    // constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.monitor_name = this.navParams.get('monitor_name');
  this.MeasurementDate = this.navParams.get('MeasurementDate');
  this.saltProducedToday = this.navParams.get('saltProducedToday');
  this.potassiumUsedToday = this.navParams.get('potassiumUsedToday');
  this.potassiumInStock = this.navParams.get('potassiumInStock');
  this.measurement1 = this.navParams.get('measurement1');
  this.measurement2 = this.navParams.get('measurement2');
  this.measurement3 = this.navParams.get('measurement3');
  this.measurement4 = this.navParams.get('measurement4');
  this.measurement5 = this.navParams.get('measurement5');
  this.measurement6 = this.navParams.get('measurement6');
  this.measurement7 = this.navParams.get('measurement7');
  this.measurement8 = this.navParams.get('measurement8');
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
