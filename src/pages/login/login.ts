import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
//import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
//export class LoginPage implements OnInit{
  export class LoginPage{
  responseData: any;
  userData = { "email": "", "pwd": "" };
  link = 'http://salt.open.org.kh/api/user_role_app';
  link_test = "user_role_app";
  loginValidate: FormGroup;
  submitAttempt: boolean = false;
  langFlag: string;
  //regExp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public http: Http,
    private network: Network,
    public formBuilder: FormBuilder,
    public sqlite:SQLite,
    public translate: TranslateService) {

      // To set default language to Khmer
      console.log("current lang = "+translate.currentLang);
      //if(translate.currentLang == undefined && localStorage.getItem("langTitle") !== "")
      console.log("localStorage lang = "+localStorage.getItem("currentLang"));
     
      if(localStorage.getItem("currentLang") == null)
      {
        this.translate.use('km');
      }
     
      this.translate.use(localStorage.getItem("currentLang")); 
      
      if(localStorage.getItem("currentLang")==="en")
      {
        this.langFlag ="assets/imgs/khmer_flag.png";
        authService.langTitle = "ភាសាខ្មែរ";
      }
        
      else
      {
        this.langFlag ="assets/imgs/english_flag.png";
        authService.langTitle = "English";
      }
        
      
      /* // To set default language to Khmer
      console.log("current lang = "+translate.currentLang);
      //if(translate.currentLang == undefined && localStorage.getItem("langTitle") !== "")
      console.log("localStorage lang = "+localStorage.getItem("langTitle"));
      if(translate.currentLang == undefined && localStorage.getItem("langTitle")==="English")
      {
        this.translate.use("km"); 
      }
      else if(translate.currentLang == undefined && localStorage.getItem("langTitle")==="ភាសាខ្មែរ")
      {
        this.translate.use("en"); 
      }
      else if(translate.currentLang === 'km')
      {
        localStorage.setItem("langTitle","English");
      }
      else if(translate.currentLang === 'en')
      {
        localStorage.setItem("langTitle","ភាសាខ្មែរ");
      }
      authService.langTitle = localStorage.getItem("langTitle"); */

      this.loginValidate = formBuilder.group({
        usr: ['',Validators.compose([Validators.required])],
        pwd: ['',Validators.required]
      });

      

  }



  // creating alert dialog
  alert(key: string) {
    let tran = '';
    this.translate.get(key).subscribe(val =>{
      tran = val;
    });

    this.alertCtrl.create({
      title: 'Info',
      subTitle: tran,
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
            let tranLoading = '';
            this.translate.get('o_loading').subscribe(val =>{
              tranLoading = val;
            });
            this.authService.presentLoadingCustom(1000, tranLoading);
            localStorage.setItem('userData', JSON.stringify(result["user"]));
            localStorage.setItem('facilityData', JSON.stringify(result["facility"]));
            if (result["user"]["role"] == 3) {
              this.createTableFacilities();
              //this.navCtrl.push(MonitorPage);
            }
            console.log("Login Successfully");
            this.navCtrl.push(HomePage);
           /*  console.log("user role = " + JSON.stringify(result["user"]["role"]));
            if (result["user"]["role"] == 2) {
              this.navCtrl.push(ProducerPage);
            }
            else if (result["user"]["role"] == 3) {
              this.createTableFacilities();
              this.navCtrl.push(MonitorPage);
            } */
          }
          // User does not exist //
          else if (result["message"] == "User doesn't exist") {
            //this.alert("User doesn't exist!");
            let tranUsrNotExist = '';
            this.translate.get('o_user_not_exist').subscribe(val =>{
              tranUsrNotExist = val;
            });
            this.authService.presentToast(tranUsrNotExist);
          }
          // Wrong password //
          else if (result["message"] == "Incorrect password") {
            this.translate.get('o_invalid_pwd').subscribe(val =>{
              this.authService.presentToast(val);
            });
            //this.authService.presentToast("Incorrect password!");
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
      {
        this.translate.get('o_enter_usr_pwd').subscribe(val =>{
          this.authService.presentToast(val);
        });
      }
        
        //this.alert("Please enter both username and password");  
    }
    else
    {
      this.translate.get('o_internet').subscribe(val =>{
        this.authService.presentToast(val);
      });
    }
     
      //this.alert("No Internet Connection!");
  }

  openProducerPage() {
    this.navCtrl.push(ProducerPage);
  }

  openMonitorPage() {
    
    this.navCtrl.push(MonitorPage);
    
  }

  /* ngOnInit()
  {
    console.log("ngOnInit langTitle = "+localStorage.getItem("langTitle"));
    if(localStorage.getItem("langTitle")==="ភាសា​ខ្មែរ")
    {
      this.translate.use('en');
    }
    else
      this.translate.use('km');    
    
  } */

  changeLanguage(){
    if(this.translate.currentLang === 'km'){
      this.translate.use('en');
      this.authService.langTitle = "ភាសា​ខ្មែរ";
      this.langFlag ="assets/imgs/khmer_flag.png";
      localStorage.setItem("currentLang","en");
    }
    else{
      this.translate.use('km');
      this.authService.langTitle = "English";
      this.langFlag ="assets/imgs/english_flag.png";
      localStorage.setItem("currentLang","km");
    }
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
