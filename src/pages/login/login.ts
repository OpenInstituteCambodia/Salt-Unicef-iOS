import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';

import { AngularFireAuth } from 'angularfire2/auth';
//import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('username') uname;
  @ViewChild('password') password;

  constructor(private alertCtrl:AlertController, private fire: AngularFireAuth, public navCtrl: NavController) {

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

  signIn()
  {
    //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.fire.auth.signInWithEmailAndPassword(this.uname.value, this.password.value)
    .then( data => {
      //console.log('data=', data);
      console.log('current user=', this.fire.auth.currentUser.email);
      this.navCtrl.setRoot(MonitorPage);
    })
    .catch( error => {
      console.log('Error=', error);
      this.alert(error.message);
    })
    //console.log(this.uname.value, this.password.value);
    // if(this.uname.value =="producer" && this.password.value == '123')
    // {
    //   // show producer page
    //   this.navCtrl.push(ProducerPage);
    // }
  }

  openProducerPage()
  {
    this.navCtrl.push(ProducerPage);
  }

  openMonitorPage()
  {
    this.navCtrl.push(MonitorPage);
  }

}
