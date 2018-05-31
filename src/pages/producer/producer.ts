import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
//import {AngularFireDatabase} from 'angularfire2/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import async from 'async';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// declare var navigator: any;
// declare var Connection: any; 
// this.platform.ready().then(() => {
//   var net:Network;
//   let disconnectSub = net.onDisconnect().subscribe(() => {
//     alert("you are offline");
//     console.log('you are offline');
//   });

//   let connectSub = net.onConnect().subscribe(()=> {
//     console.log('you are online');
//     alert("you are online");
//   });

//  });



/**
 * Generated class for the ProducerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-producer',
  templateUrl: 'producer.html',
})



export class ProducerPage {
  responseData: any;
  userData = { "email": "", "pwd": "" };
  link = 'http://salt.open.org.kh/api/user_role_app';

  //reportNo: string ='1';
  //facilityId: string = '';
  data: any = {};
  producerName: string = '';
  producerId: string = '';
  MeasurementDate: string = '';
  saltProducedToday: string = '';
  potassiumUsedToday: string = '';
  potassiumInStock: string = '';
  measurement1: string = '';
  measurement2: string = '';
  measurement3: string = '';
  measurement4: string = '';
  measurement5: string = '';
  measurement6: string = '';
  measurement7: string = '';
  measurement8: string = '';
  userId: string = '';
  currentDate: any;
  listOfAllTable = ["monitor_measurements", "producer_measurements"];
  hasOffline: number = 0;
  producerValidate: FormGroup;
  submitAttempt: boolean = false;

  // Update on 12-03-2018 by Samak //
  constructor(
    private network: Network,
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    public navParams: NavParams,
    public http: Http,
    public authService: AuthServiceProvider,
    private toastCtrl: ToastController,
    public appCtrl: App,
    public formBuilder: FormBuilder
  ) {
    var localStorage_facilityData = JSON.parse(localStorage.getItem("facilityData"));
    var localStorage_userData = JSON.parse(localStorage.getItem("userData"));
    this.producerId = localStorage_facilityData.id;
    this.producerName = localStorage_facilityData.facility_name;
    console.log("this.producerId = " + this.producerId);
    this.userId = localStorage_userData.id;
    this.producerName = this.producerName;
    this.MeasurementDate = this.navParams.get('MeasurementDate');
    this.saltProducedToday = this.navParams.get('saltProducedToday');
    this.potassiumUsedToday = this.navParams.get('potassiumUsedToday');
    this.potassiumInStock = this.navParams.get('potassiumInStock');
    this.measurement1 = this.navParams.get('measurement1');
    this.measurement2 = this.navParams.get('measurement2');
    this.measurement3 = this.navParams.get('measurement3');
    this.measurement4 = this.navParams.get('measurement4');
    this.measurement5 = this.navParams.get('measurement5');
    this.measurement6 = this.navParams.get('measurement6');
    this.measurement7 = this.navParams.get('measurement7');
    this.measurement8 = this.navParams.get('measurement8');
    this.http = http;

    this.producerValidate = formBuilder.group({
      //usr: ['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]'{'2,4'}'$")])],
      measureDate: ['',Validators.required],
      saltProDaily: ['',Validators.required],
      potassiumDaily: ['',Validators.required],
      potassiumStock: ['',Validators.required],
      measure1: ['',Validators.required]
    });
    
  }

  ionViewDidLoad() {
    //this.createTable();
    //console.log('ionViewDidLoad ProducerPage');
  }

  ionViewWillEnter() {
    this.createTable();
    this.currentDate = new Date().toISOString();
  }


  createTable() {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS producer_measurements (facility_id INT, date_of_data TEXT, stock_potassium INT, quantity_potassium_iodate INT, quantity_salt_processed INT, measurement_1 INT, measurement_2 INT,measurement_3 INT,measurement_4 INT,measurement_5 INT,measurement_6 INT,measurement_7 INT, measurement_8 INT, user_id INT, isSent INT)', {})
        .then(res => console.log('execuated SQL'))
        .catch(e => console.log(e));
    })
  }

  saveMeasurement() {
    this.submitAttempt = true;

    if(this.producerValidate.valid)
    {
      this.sqlite.create({
        name: 'unicef_salt',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO producer_measurements (facility_id, date_of_data, stock_potassium, quantity_potassium_iodate, quantity_salt_processed, measurement_1, measurement_2,measurement_3,measurement_4,measurement_5,measurement_6,measurement_7, measurement_8, user_id, isSent) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.producerId, this.MeasurementDate, this.potassiumInStock, this.potassiumUsedToday, this.saltProducedToday, this.measurement1, this.measurement2, this.measurement3, this.measurement4, this.measurement5, this.measurement6, this.measurement7, this.measurement8, this.userId, 0])
          .then(res => {
            console.log('Data Inserted !');


              if (this.network.type == "none") {
                this.authService.presentLoadingCustom(3000, "Saving data offline ...");
                //this.hasOfflineData("producer_measurements");
                this.authService.hasOfflineData("producer_measurements",HomePage);
                
              }
              else {
                this.authService.synchDataToServerUseService(HomePage,"producer_measurements");//=> working fine
                this.authService.presentLoadingCustom(5000, "Saving data ...");
                
              }
            
          })
          .catch(e => console.log(e));
    })
  }
  else
    this.authService.presentToast("The fields with asterike (*) are required");
  }

  /* public updateIsSentColumn() {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE producer_measurements SET isSent=? WHERE isSent=0', [1])
        .then(res => {
          console.log('Data Updated!');
          this.hasOfflineData("producer_measurements");
        })
        .catch(e => console.log(e));
    })
  }

  public synchDataToServerUseService() {
    
    var listOfTable = "producer_measurements";
    console.log("table= " + listOfTable);
    var self = this;
    this.retrieveDB(listOfTable)
      .then(function (value) {
        self.authService.postData(value, "sync_data_app").then((result) => {
          self.responseData = result;
          if (JSON.parse(result["code"]) == 200) {
            // If data is synch successfully, update isSent=1 //
            self.updateIsSentColumn(); //=> working well, but try funtion in service instead.
            // self.authService.updateIsSentColumn("producer_measurements","isSent",1); => error
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
  } */

  public retrieveDB(listOfTable: string) {
    var data_return = [];
    var _data = {};
    var self = this;
    var asyncTasks = [];

    var pro = new Promise(function (resolve, reject) {
      //for (var tableName of listOfTable) {
      var subTasks = [];
      _data[listOfTable] = [];

      subTasks.push(async function (callback) {
        var colNames = [];
        console.log('tableSchema');
        try {
          var db = await self.sqlite.create({
            name: 'unicef_salt',
            location: 'default'
          });

          var resColNames = await db.executeSql("PRAGMA table_info('" + listOfTable + "')", {});

          for (var index = 0; index < resColNames.rows.length; index++) {
            colNames[index] = resColNames.rows.item(index).name;
          }

          callback(null, colNames);
        } catch (err) {
          console.log(err);
        }
      });

      subTasks.push(async function (colNames, callback) {
        console.log('colNames: ' + colNames);
        try {
          var db = await self.sqlite.create({
            name: 'unicef_salt',
            location: 'default'
          });
          var resOfflineRecords = await db.executeSql('SELECT * FROM ' + listOfTable + ' where isSent=?', [0])
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

            _data[listOfTable].push(obj);
            //console.log('_data = ' + JSON.stringify(_data));
          }
          callback(null, _data);
        } catch (err) {
          console.error(err);
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
      // } End For of tableName

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

  old_retrieveDB(listOfTable: string[]) {
    var data_return = [];
    var _data = {};
    var self = this;
    var asyncTasks = [];

    var pro = new Promise(function (resolve, reject) {
      for (var tableName of listOfTable) {
        var subTasks = [];
        _data[tableName] = [];

        subTasks.push(async function (callback) {
          var colNames = [];

          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });

            var resColNames = await db.executeSql("PRAGMA table_info('producer_measurements')", {});

            for (var index = 0; index < resColNames.rows.length; index++) {
              colNames[index] = resColNames.rows.item(index).name;
            }

            callback(null, colNames);
          } catch (err) {
            console.log(err);
          }
        });

        subTasks.push(async function (colNames, callback) {
          console.log('colNames: ' + colNames);
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });
            var resOfflineRecords = await db.executeSql('SELECT * FROM producer_measurements where isSent=?', [0])
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
      }

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

  goToHomePage() {
    //this.navCtrl.push(HomePage);
    this.appCtrl.getActiveNav().push(HomePage);
    // this.hasOfflineData(this.listOfAllTable); 
    // => error: data is not consistant, get no. of offline records because data sent to server. 
    // so no. of offline records is wrong.
    // sol: move this code to asyn.series
  }

  hasOfflineData(tableName: string) 
  {
    // for (var tableName of listOfAllTable) 
    // {
      try {
        this.sqlite.create({
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
                if(num_offline_records == 1)
                {
                  console.log('hasOffline in producer page = '+this.hasOffline);
                  let connectSubscription = this.network.onConnect().subscribe(() => {
                    console.log('network connected!');
                    // We just got a connection but we need to wait briefly
                    // before we determine the connection type. Might need to wait.
                    // prior to doing any api requests as well.
                    setTimeout(() => {
                      if(parseInt(localStorage.getItem('offline'))>0)
                      {
                        this.authService.synchDataToServerUseService(HomePage,"producer_measurements");
                      }
                      connectSubscription.unsubscribe();
                    }, 0);
                  });
                }
              }
            //this.goToHomePage();
            this.navCtrl.setRoot(HomePage);
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
      }
    //}
  }

} // End class

