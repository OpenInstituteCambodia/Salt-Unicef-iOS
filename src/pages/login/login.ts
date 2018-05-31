import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
//import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData: any;
  userData = { "email": "", "pwd": "" };
  link = 'http://salt.open.org.kh/api/user_role_app';
  link_test = "user_role_app";
  loginValidate: FormGroup;
  submitAttempt: boolean = false;
  //regExp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public http: Http,
    private network: Network,
    public formBuilder: FormBuilder,
    public sqlite:SQLite) {
      //let regExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      this.loginValidate = formBuilder.group({
        //usr: ['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]'{'2,4'}'$")])],
        usr: ['',Validators.compose([Validators.required])],
        pwd: ['',Validators.required]
      });

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
    this.submitAttempt = true;

    if (this.network.type != "none") {
      if(this.loginValidate.valid)
      {
        this.authService.postData(this.userData, this.link_test).then((result) => {
          
          console.log("result = " + JSON.stringify(result));
          if (result["message"] == "Ok") {
            this.authService.presentLoadingCustom(1000, "Loading...");
            localStorage.setItem('userData', JSON.stringify(result["user"]));
            localStorage.setItem('facilityData', JSON.stringify(result["facility"]));
            console.log("Login Successfully");
            console.log("user role = " + JSON.stringify(result["user"]["role"]));
            if (result["user"]["role"] == 2) {
              this.navCtrl.push(ProducerPage);
            }
            else if (result["user"]["role"] == 3) {
              this.createTableFacilities();
              this.navCtrl.push(MonitorPage);
            }
          }
          // User does not exist //
          else if (result["message"] == "User doesn't exist") {
            //this.alert("User doesn't exist!");
            this.authService.presentToast("User doesn't exist!");
          }
          // Wrong password //
          else if (result["message"] == "Incorrect password") {
            this.authService.presentToast("Incorrect password!");
            //this.alert("Incorrect password!");
          }
          else
            console.log("Error login");
        }, (err) => {
          // Connection fail
          console.log(JSON.stringify("err = " + err));
        });
      }
      else
        this.authService.presentToast("Please enter both username and password");
        //this.alert("Please enter both username and password");  
    }
    else
      this.authService.presentToast("No Internet Connection!");
      //this.alert("No Internet Connection!");
  }

  openProducerPage() {
    this.navCtrl.push(ProducerPage);
  }

  openMonitorPage() {
    
    this.navCtrl.push(MonitorPage);
    
  }

  createTableFacilities() {
    console.log("created facilities table");
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS facilities (id INT PRIMARY KEY, facility_ref_id TEXT, facility_name TEXT, Latitude TEXT, Longitude TEXT, created_at TEXT, updated_at TEXT)', {})
        .then(res => console.log('execuated SQL in createTableFacilities!'))
        .catch(e => console.log(e));
    })
  }

}
