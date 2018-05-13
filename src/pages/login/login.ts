import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
//import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData: any;
  userData = { "email": "", "pwd": "" };
  link = 'http://salt.open.org.kh/api/user_role_app';
  link_test = "user_role_app";
  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public http: Http,
    private network: Network) {

  }



  // creating alert dialog
  alert(message: string) {
    this.alertCtrl.create({
      title: 'Info',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  signIn() {
    console.log("userData = " + JSON.stringify(this.userData));
    if (this.network.type != "none") {
      this.authService.postData(this.userData, this.link_test).then((result) => {
        console.log("result = " + JSON.stringify(result));
        if (result["message"] == "Ok") {
          localStorage.setItem('userData', JSON.stringify(result["user"]));
          localStorage.setItem('facilityData', JSON.stringify(result["facility"]));
          console.log("Login Successfully");
          console.log("user role = " + JSON.stringify(result["user"]["role"]));
          if (result["user"]["role"] == 2) {
            this.navCtrl.push(ProducerPage);
          }
          else if (result["user"]["role"] == 3) {
            this.navCtrl.push(MonitorPage);
          }
        }
        // User does not exist //
        else if (result["message"] == "User doesn't exist") {
          this.alert("User doesn't exist!");
        }
        // Wrong password //
        else if (result["message"] == "Incorrect password") {
          this.alert("Incorrect password!");
        }
        else
          console.log("Error");
      }, (err) => {
        // Connection fail
        console.log(JSON.stringify("err = " + err));
      });
    }
    else
      this.alert("No Internet Connection!");
  }

  openProducerPage() {
    this.navCtrl.push(ProducerPage);
  }

  openMonitorPage() {
    this.navCtrl.push(MonitorPage);
  }

}
