import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';


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
  listOfAllTable = ["producer_measurements","monitor_measurements"];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController, 
    public platform: Platform,
    private sqlite: SQLite,
    public authService: AuthServiceProvider,
  public network: Network) {
    var self = this;
    this.localStorage_userData = JSON.parse(localStorage.getItem("userData"));
    if(this.localStorage_userData != null)
      this.userRole = this.localStorage_userData.role;
    console.log('Constructor HomePage');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    var producerForm : ProducerPage;
    this.hasOffline= localStorage.getItem("offline");
    console.log('hasOffline in ionViewDidLoad HomePage = '+this.hasOffline);
    
      /* let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if(this.hasOffline>0)
          {
            this.authService.synchDataToServerUseService(HomePage,this.listOfAllTable[this.userRole-2]);
            
          }
          connectSubscription.unsubscribe();
        }, 0);
      }); */
      if(this.hasOffline == 1)
      {
        let connectSubscription = this.network.onConnect().subscribe(() => {
          console.log('network connected!');
          // We just got a connection but we need to wait briefly
          // before we determine the connection type. Might need to wait.
          // prior to doing any api requests as well.
          setTimeout(() => {
            if(parseInt(localStorage.getItem('offline'))>0)
            {
              this.authService.synchDataToServerUseService(HomePage,this.listOfAllTable[this.userRole-2]);
            }
            connectSubscription.unsubscribe();
          }, 0);
        });
      }
  }

  ionViewWillEnter()  {
  }

  goToDaily()
  {
    
    if(this.userRole == 2)
    {
      this.navCtrl.push(ProducerPage);
      //this.exit();
    }
    else if(this.userRole == 3)
    {
      this.navCtrl.push(MonitorPage);
      //this.exit();
    }
  }

  exit(){
    this.exit();
  }

  private exitButtonClick() {
    let alert = this.alertCtrl.create({
      title: 'Exit App',
      message: '​Are you sure you want to exit?',
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Confirm",
          handler: () => {
            this.platform.exitApp();
          }
        },
      ]
    });
    alert.present();
  }
}
