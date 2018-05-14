import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  localStorage_userData : any;
  userRole:number;
  hasOffline:any=0;
  hasOfflineTest: any;
  listOfAllTable = ["monitor_measurements","producer_measurements"];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController, 
    public platform: Platform,
    private sqlite: SQLite,
    public authService: AuthServiceProvider) {
    this.localStorage_userData = JSON.parse(localStorage.getItem("userData"));
    if(this.localStorage_userData != null)
      this.userRole = this.localStorage_userData.role;
    //this.hasOffline= this.hasOfflineData(this.listOfTable);
    console.log('Constructor');
    //console.log('hasOffline = '+this.hasOffline);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    
    //this.hasOfflineData(this.listOfAllTable);
    this.hasOffline= localStorage.getItem("offline");
    console.log('hasOffline in ionViewDidLoad = '+this.hasOffline);
  }

  ionViewWillEnter()  {
    // console.log('ionViewDidLoad HomePage');
    
    // this.hasOffline= this.hasOfflineData(this.listOfTable);
    // console.log('hasOffline in ionViewWillEnter = '+this.hasOffline);
    
  }

  goToDaily()
  {
    
    if(this.userRole == 2)
    {
      this.navCtrl.push(ProducerPage);
    }
    else if(this.userRole == 3)
    {
      this.navCtrl.push(MonitorPage);
    }
  }

  exit(){
    this.exit();
  }

   

  private exitButtonClick() {
    let alert = this.alertCtrl.create({
      title: 'Exit App',
      message: 'Are you sure you want to exit App?​',
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Yes",
          handler: () => {
            this.platform.exitApp();
          }
        },
      ]
    });
    alert.present();
  }

  hasOfflineData(listOfAllTable: string[])
  {
  
    console.log("listOfAllTable.length= "+listOfAllTable.length);
    for (var tableName of listOfAllTable) {
      try {
        this.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT count(*) as total FROM '+ tableName +' where isSent=?', [0])
            .then(res => {
              let num_offline_records = res.rows.item(0).total;
              
              if(num_offline_records>0)
              {
                //localStorage.setItem("offline",(num_offline_records-1).toString());
                console.log('num_offline_records = '+' of '+tableName +' = '+num_offline_records);
                this.hasOffline = num_offline_records;
                console.log('this.hasOffline = ' + this.hasOffline);
              }
              
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
      }
    }
  }
  
}
