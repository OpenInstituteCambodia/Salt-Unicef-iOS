import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';


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
  langFlag: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController, 
    public platform: Platform,
    private sqlite: SQLite,
    public authService: AuthServiceProvider,
    public network: Network,
    public translate: TranslateService) {
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
      this.createTableFacilities();
      this.navCtrl.push(MonitorPage);
      //this.exit();
    }
  }

  exit(){
    this.exit();
  }

  private exitButtonClick() {
    let t = '';
    this.translate.get('o_exitApp').subscribe(val =>{
      t=val;
    });

    let sms = '';
    this.translate.get('o_exit').subscribe(val =>{
      sms=val;
    });

    let no = '';
    this.translate.get('m_no').subscribe(val =>{
      no=val;
    });

    let con = '';
    this.translate.get('o_confirm').subscribe(val =>{
      con=val;
    });

    let alert = this.alertCtrl.create({
      title: t,
      message: sms,
      buttons: [
        {
          text: no,
          role: 'cancel'
        },
        {
          text: con,
          handler: () => {
            this.platform.exitApp();
          }
        },
      ]
    });
    alert.present();
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


}
