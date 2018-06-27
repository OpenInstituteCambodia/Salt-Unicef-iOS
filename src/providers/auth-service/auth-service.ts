import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'; 
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController, LoadingController, App } from 'ionic-angular';
//import { HomePage } from '../../pages/home/home';
import { Page } from 'ionic-angular/navigation/nav-util';
import async from 'async';
//import { Network } from '@ionic-native/network';

let apiUrl = "http://salt.open.org.kh/api/";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  //home: Page = HomePage;
  listOfAllTable = ["monitor_measurements", "producer_measurements"];
  responseData: any;
  langTitle: string;

  constructor(public http: Http,
    private sqlite: SQLite,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public appCtrl : App
  ) {
    console.log('Hello AuthServiceProvider Provider');
  }

  postData(credentials, type){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      //this.http.post(apiUrl+type, JSON.stringify(credentials),{headers: headers})
      console.log("credentials data = "+JSON.stringify(credentials));
      //console.log("apiUrl+type = "+apiUrl+type);
      //this.http.post(apiUrl+type, credentials)
      this.http.post(apiUrl+type, credentials,{headers: headers})
      .subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
      
    });
  }

  getData(type){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.get(apiUrl+type, {headers: headers})
      .subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
      
    });
  }

  hasOfflineData(tableName: string, home: Page)
  {
    var self = this;
    console.log("listOfAllTable.length of table = "+ tableName+" = " + self.listOfAllTable.length);
    //var proHasOff = new Promise(function (resolve, reject){ => not working
    //for (var tableName of self.listOfAllTable) {
      try {
        self.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          //db.executeSql('SELECT count(isSent) as totalCount FROM '+ tableName +' where isSent=?', [0])
          db.executeSql('SELECT sum(case when isSent=0 then 1 else 0 end) as totalCount FROM ' +tableName, [])
          //db.executeSql('SELECT sum(case when isSent=0 then 1 else 0 end) as totalCount FROM producer_measurements', []) => working
            .then(res => {
              console.log("res = " + JSON.stringify(res));
              var num_offline_records = res.rows.item(0).totalCount;
              localStorage.setItem("offline", (num_offline_records).toString());
              console.log('num_offline_records before if = ' + ' of ' + tableName + ' = ' + num_offline_records);
              this.appCtrl.getActiveNav().push(home);
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
        console.log("Cannot find table ="+ tableName);
      }
   // }
  //});
  //return proHasOff;
  }

  /* hasOfflineData(tableName: string, home: Page)
  {
    var self = this;
    console.log("listOfAllTable.length= " + self.listOfAllTable.length);
    //var proHasOff = new Promise(function (resolve, reject){ => not working
    //for (var tableName of self.listOfAllTable) {
      try {
        self.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          //db.executeSql('SELECT count(isSent) as totalCount FROM '+ tableName +' where isSent=?', [0])
          db.executeSql('SELECT sum(case when isSent=0 then 1 else 0 end) as totalCount FROM ' + tableName, [])
            .then(res => {
              console.log("res = " + JSON.stringify(res));
              var num_offline_records = res.rows.item(0).totalCount;
              localStorage.setItem("offline", (num_offline_records).toString());
              console.log('num_offline_records before if = ' + ' of ' + tableName + ' = ' + num_offline_records);
              if (num_offline_records > 0) {
                localStorage.setItem("offline", (num_offline_records).toString());
                console.log('num_offline_records in if = ' + ' of ' + tableName + ' = ' + num_offline_records);
                //this.hasOffline = num_offline_records;
                console.log('offline in localStorage = ' + localStorage.getItem("offline"));
                console.log('toStr of 1 = ' + (1).toString());
                console.log('toStr of 2 = ' + (2).toString());
              }
            //self.goToHomePage();
            //self.app.getRootNav().push(self.home);
            this.appCtrl.getActiveNav().push(home);
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
      }
   // }
  //});
  //return proHasOff;
  } */

  presentToast(msg: string) {
    let toastObj = this.toastCtrl.create({
      message: msg,
      position: "bottom",
      duration: 4000
    });
    toastObj.present();
  }

  presentLoadingCustom(duriationTime: number, str: string) {
    let loading = this.loadingCtrl.create({
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> `+ str +` </div>
        </div>`,
      duration: duriationTime
    });
  
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    loading.present();
  }

  updateIsSentColumn(tblName: string, fieldName: string, val: number, home: Page) {
    var self = this;
    self.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE '+ tblName +' SET '+ fieldName+'=? WHERE '+fieldName+'=0', [val])
        .then(res => {
          console.log('Data Updated!');
          self.hasOfflineData(tblName, home);
        })
        .catch(e => console.log(e));
    })
  }

  /* goToHomePage() {
    var self = this;
    self.appCtrl.getActiveNav().push(self.home);
  } */

  public retrieveDB(tableName: string) {
    var data_return = [];
    var _data = {};
    var self = this;
    var asyncTasks = [];

    var pro = new Promise(function (resolve, reject) {
      //for (var tableName of listOfTable) {
        var subTasks = [];
        _data[tableName] = [];

        subTasks.push(async function (callback) {
          var colNames = [];
          console.log('tableSchema');
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });

            var resColNames = await db.executeSql("PRAGMA table_info('" + tableName + "')", {});

            for (var index = 0; index < resColNames.rows.length; index++) {
              colNames[index] = resColNames.rows.item(index).name;
            }
            console.log('colNames of table '+tableName+' in subTask1: ' + colNames);
            callback(null, colNames);
          } catch (err) {
            console.log(err);
          }
        });

        subTasks.push(async function (colNames, callback) {
          if(tableName=="producer_measurements"){
            console.log('colNames of table producer_measurements: ' + colNames);
            try {
              var db = await self.sqlite.create({
                name: 'unicef_salt',
                location: 'default'
              });
              var resOfflineRecords = await db.executeSql('SELECT * FROM ' + tableName + ' where isSent=?', [0])
              for (var i = 0; i < resOfflineRecords.rows.length; i++) {
                var eachData = resOfflineRecords.rows.item(i);
                // Retrieve All Columns Name From table producer_measurements //
                var valFromTable = [eachData.facility_id,
                eachData.date_of_data,
                eachData.stock_potassium,
                eachData.quantity_potassium_iodate,
                eachData.quantity_salt_processed,
                eachData.measurement_1,
                eachData.measurement_2,
                eachData.measurement_3,
                eachData.measurement_4,
                eachData.measurement_5,
                eachData.measurement_6,
                eachData.measurement_7,
                eachData.measurement_8,
                eachData.user_id];
                var col = null;
                var obj = {};
                for (var j = 0; j < colNames.length; j++) {
                  // Construct JSON string with key (column name)/value (offline data) pair //
                  col = colNames[j];
                  obj[col] = valFromTable[j];
                }

                _data[tableName].push(obj);
                //console.log('_data = ' + JSON.stringify(_data));
              }
              callback(null, _data);
            } catch (err) {
              console.error(err);
            }
          }
          else if(tableName=="monitor_measurements"){
            console.log('colNames of table monitor_measurements: ' + colNames);
            try {
              var dbMonitor = await self.sqlite.create({
                name: 'unicef_salt',
                location: 'default'
              });
              var resOfflineRecordsMonitor = await dbMonitor.executeSql('SELECT * FROM '+ tableName +' where isSent=?', [0])
              for (var iMonitor = 0; iMonitor < resOfflineRecordsMonitor.rows.length; iMonitor++) {
                var eachDataMonitor = resOfflineRecordsMonitor.rows.item(iMonitor);
                // Retrieve All Columns Name From table producer_measurements //
                var valFromTableMonitor = [eachDataMonitor.monitor_id,
                  eachDataMonitor.facility_id,
                  eachDataMonitor.at_producer_site,
                  eachDataMonitor.location,
                  eachDataMonitor.latitude,
                  eachDataMonitor.longitude,
                  eachDataMonitor.measurement,
                  eachDataMonitor.warning,
                  eachDataMonitor.date_of_visit,
                  eachDataMonitor.date_of_follow_up];
                var colIndex = null;
                var objColname = {};
                for (var jColname = 0; jColname < colNames.length; jColname++) {
                  // Construct JSON string with key (column name)/value (offline data) pair //
                  colIndex = colNames[jColname];
                  objColname[colIndex] = valFromTableMonitor[jColname];
                }

                _data[tableName].push(objColname);
                console.log('_data = ' + JSON.stringify(_data));

                
              }
              callback(null, _data);
            } catch (err) {
              console.error(err);
            }
          }
        });

        asyncTasks.push(function (callback) {
          async.waterfall(subTasks, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              data_return.push(data);
              callback(null);
            }
          });
        });
      //} //End For of tableName

      async.series(asyncTasks, function (err, data) {
        if (err) {
          console.error(err);
        } else {
          resolve(data_return);
          //self.hasOfflineData(listOfTable); => error: here isSent is not yet updated to 1.
          //console.log(JSON.stringify(data_return));
        }
      });
    });

    return pro;
  }

  public synchDataToServerUseService(home: Page, tblName: string) {
    
    var table = tblName;
    console.log("table= " + table);
    var self = this;
    //var proSynch = new Promise(function (resolve, reject) {
      self.retrieveDB(tblName)
      .then(function (value) {
        self.postData(value, "sync_data_app").then((result) => {
          self.responseData = result;
          if (JSON.parse(result["code"]) == 200) {
            // If data is synch successfully, update isSent=1 //
            //this.updateIsSentColumn(); //=> working well, but try funtion in service instead.
            self.updateIsSentColumn(tblName,"isSent",1,home); 
           //self.hasOfflineData(listOfTables);
            console.log("Data Inserted Successfully");
          }
          else
            console.log("Synch Data Error");
          console.log("response = " + JSON.stringify(self.responseData));
        }, (err) => {
          // Connection fail
          console.log(JSON.stringify("err = " + err));
        });
      })
      .catch((e) => {
        console.log('bleh:' + e);
      });
    //});
   // return proSynch;
  }
 
}
