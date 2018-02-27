import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
// import * as firebase from 'firebase/app';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


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

  constructor(public db: AngularFireDatabase, private fire: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) 
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
    // .then(() => {
    //   // save data
    // });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorPage');
  }

}
