import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';

// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabase } from 'angularfire2/database';
// // import * as firebase from 'firebase/app';
// //import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Toast } from '@ionic-native/toast';
import async from 'async';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {
  responseData : any;
  monitorID: number=0;
  producerID: number=0;
  measurementDate: string ="";
  isAtProducer: number=0;
  location: string ="";
  measurement: number=0;
  warningOrNot: number=0;
  followUpDate: string ="";
  monitor_name:string ="";
  monitorMeasurementData = {"monitor_id":"","facility_id":"", "at_producer_site":"", "location":"", "latitude":"", "longitude":"", "measurement":"", "warning":"", "date_of_visit":"", "date_of_follow_up":""};

  constructor(private network: Network,private alertCtrl:AlertController, private toast: Toast,
    // private fire: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private app: App, private sqlite: SQLite, 
    public authService: AuthServiceProvider) 
  {
    //console.log(this.navParams);
    var localStorage_userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData = "+JSON.stringify(localStorage_userData));
    this.monitorMeasurementData.monitor_id =localStorage_userData.id;
    this.monitor_name = localStorage_userData.name;
    //console.log("this.monitorMeasurementData.monitor_id = "+this.monitorMeasurementData.monitor_id);

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

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        alert("Connected");
        this.synchMonitorDataToServerUseService();
        connectSubscription.unsubscribe();
      }, 0);
    });
  }
  
  createTableMonitor(){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('CREATE TABLE IF NOT EXISTS monitor_measurements (monitor_id INT, facility_id INT, at_producer_site INT, location TEXT, latitude TEXT, longitude TEXT, measurement INT, warning INT, date_of_visit TEXT,date_of_follow_up TEXT, isSent INT)', {})
      .then( res => console.log('execuated SQL!'))
      .catch(e => console.log(e));
    })
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
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql(' INSERT INTO monitor_measurements (monitor_id, facility_id, at_producer_site, location, latitude, longitude, measurement, warning,date_of_visit,date_of_follow_up, isSent) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
       [this.monitorMeasurementData.monitor_id, this.monitorMeasurementData.facility_id,this.monitorMeasurementData.at_producer_site, this.monitorMeasurementData.location,this.monitorMeasurementData.latitude,this.monitorMeasurementData.longitude,
        this.monitorMeasurementData.measurement, this.monitorMeasurementData.warning, this.monitorMeasurementData.date_of_visit, this.monitorMeasurementData.date_of_follow_up,0])
      .then( res => {
        console.log('Data Inserted !');
        this.toast.show('Monitor Data has been saved offline!', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      })
      .catch(e => console.log(e));
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorPage');
    this.createTableMonitor();
  }

  retrieveDB(listOfTable:string[]){
    var data_return = [];
    var _data = {};
    var self = this;
    var asyncTasks = [];

    var pro = new Promise(function(resolve, reject) {
      for (var tableName of listOfTable) {
        var subTasks = [];
        _data[tableName] = [];
        
        subTasks.push(async function(callback) {
          var colNames = [];
  
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });
  
            var resColNames = await db.executeSql("PRAGMA table_info('monitor_measurements')",{});
    
            for (var index = 0; index < resColNames.rows.length; index++) {
              colNames[index]=resColNames.rows.item(index).name;
            }

            callback(null, colNames);
          } catch (err) {
            console.log(err);
          }
        });
  
        subTasks.push(async function(colNames, callback) {
          console.log('colNames: ' + colNames);
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });
            var resOfflineRecords = await db.executeSql('SELECT * FROM monitor_measurements where isSent=?',[0])
            for (var i = 0; i < resOfflineRecords.rows.length; i++) {
              var eachData = resOfflineRecords.rows.item(i);
              // Retrieve All Columns Name From table producer_measurements //
              var valFromTable = [eachData.monitor_id,
              eachData.facility_id,
              eachData.at_producer_site,
              eachData.location,
              eachData.latitude,
              eachData.longitude,
              eachData.measurement,
              eachData.warning,
              eachData.date_of_visit,
              eachData.date_of_follow_up];
              var col = null;
              var obj = {};
              for (var j = 0; j < colNames.length; j++) {
                // Construct JSON string with key (column name)/value (offline data) pair //
                col = colNames[j];
                obj[col] = valFromTable[j];
              }
              
              _data[tableName].push(obj);
              console.log('_data = ' + JSON.stringify(_data));
    
              callback(null, _data);
            }
          } catch (err) {
            console.error(err);
          }
        });
  
        asyncTasks.push(function(callback) {
          async.waterfall(subTasks, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              data_return.push(data);
              callback(null);
            }
          });
        });
      }
  
      async.series(asyncTasks, function(err, data) {
        if (err) {
          console.error(err);
        } else {
          resolve(data_return);
          console.log(JSON.stringify(data_return));
        }
      });
    });

    return pro;
  }

  synchMonitorDataToServerUseService() {
    var listOfTable = ["monitor_measurements"];
    var self = this;
    this.retrieveDB(listOfTable)
      .then(function(value) {
        self.authService.postData(value,"sync_data_app").then((result) => {
          self.responseData = result;
          if(JSON.parse(result["code"])==200) 
          {
            // If data is synch successfully, update isSent=1 //
            self.updateIsSentColumn();
            console.log("Data Inserted Successfully");
          }
          else
            console.log("Synch Data Error");
          console.log("response = "+JSON.stringify(self.responseData));
        }, (err) => {
        // Connection fail
        console.log(JSON.stringify("err = "+err));
        });
      })
      .catch((e) => {
        console.log('bleh:' + e);
      });
  }

  updateIsSentColumn(){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('UPDATE monitor_measurements SET isSent=? WHERE isSent=0', [1])
      .then( res => {
        console.log('Data Updated!');
      })
      .catch(e => console.log(e));
    })
  }
}