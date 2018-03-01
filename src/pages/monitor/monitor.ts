import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
// import * as firebase from 'firebase/app';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

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

  constructor(public db: AngularFireDatabase, private alertCtrl:AlertController, 
    // private fire: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private app: App) 
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
  }

}
