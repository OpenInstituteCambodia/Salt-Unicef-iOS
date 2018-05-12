import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import {AngularFireDatabase} from 'angularfire2/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import async from 'async';

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
  currentDate : any;

  // Update on 12-03-2018 by Samak //
  constructor(
    private network: Network,
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    public navParams: NavParams,
    public http: Http,
    public authService: AuthServiceProvider
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

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.synchDataToServerUseService();
        connectSubscription.unsubscribe();
      }, 0);
    });

  }

  ionViewDidLoad() {
    this.createTable();
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

    // this.network.onConnect().subscribe(data => {
    //   console.log(data);
    //    this.toast.show('There is internet', '200', 'center').subscribe(
    //   toast => {
    //     this.navCtrl.popToRoot();
    //   }
    // );
    //   // Send Data To API 
    // }, error => console.error(error));

    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO producer_measurements (facility_id, date_of_data, stock_potassium, quantity_potassium_iodate, quantity_salt_processed, measurement_1, measurement_2,measurement_3,measurement_4,measurement_5,measurement_6,measurement_7, measurement_8, user_id, isSent) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.producerId, this.MeasurementDate, this.potassiumInStock, this.potassiumUsedToday, this.saltProducedToday, this.measurement1, this.measurement2, this.measurement3, this.measurement4, this.measurement5, this.measurement6, this.measurement7, this.measurement8, this.userId, 0])
        .then(res => {
          console.log('Data Inserted !');
          if(this.network.type == "none")
          {
            this.toast.show('Data saved offline', '5000', 'center').subscribe(
              toast => {
                this.navCtrl.popToRoot();
              }
            );
          }
          else
            this.synchDataToServerUseService();  
        })
        .catch(e => console.log(e));
    })
  }

  updateIsSentColumn() {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE producer_measurements SET isSent=? WHERE isSent=0', [1])
        .then(res => {
          console.log('Data Updated!');
        })
        .catch(e => console.log(e));
    })
  }

  producerFormSendData() {
    // Save data in SQLite database: unicef_salt //
    this.saveMeasurement();
    // If there is Internet connection => Synch Offline data into server: salt.open.org.kh/api/sync_data_app //
    // watch network for a connection
    //s if(this.connectSubscription){
    //s this.synchDataToServerUseService();
    //s }

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.synchDataToServerUseService();
        connectSubscription.unsubscribe();
      }, 0);
    });




    /* // Not working //
    this.network.onConnect().subscribe(data => {
        console.log(data);
        // Synch offline data //
        this.synchDataToServerUseService();
        // Display toast message //
        this.toast.show('There is Internet', '200', 'center').subscribe(
        toast => {
          this.navCtrl.push(ProducerPage);
        }
      ); 
    }, error => console.error(error));
    */
  }

  synchDataToServer() {
    var link_sync = 'http://salt.open.org.kh/api/sync_data_app';
    //console.log("I'm here");
    // var myData = JSON.stringify([ { "producers" : [ {"facility_id":"1","measurement_1":"20","measurement_2":"30"}, {"facility_id":"1","measurement_1":"10","measurement_2":"20"} ] }, { "monitors" : [ {"producer_id":"2","measurement":"20","warning" :"0"}, {"producer_id":"2","measurement":"10","warning" :"1"} ] } ]);
    /*var myData = JSON.stringify(
    [ { "producers" : [ {"facility_id":"1","measurement_1":this.measurement1,"measurement_2":this.measurement2},
                        {"facility_id":"1","measurement_1":"10","measurement_2":"20"} ] }, 
      { "monitors" : [ {"producer_id":"2","measurement":"20","warning" :"0"}, 
                       {"producer_id":"2","measurement":"10","warning" :"1"} ] } 
    ]);*/
    var myData =
      [{
        "producer_measurements": [{
          "facility_id": "1",
          "quantity_salt_processed": this.saltProducedToday,
          "quantity_potassium_iodate": this.potassiumUsedToday,
          "stock_potassium": this.potassiumInStock,
          "measurement_1": this.measurement1,
          "measurement_2": this.measurement2,
          "measurement_3": this.measurement3,
          "measurement_4": this.measurement4,
          "measurement_5": this.measurement5,
          "measurement_6": this.measurement6,
          "measurement_7": this.measurement7,
          "measurement_8": this.measurement8
        }
        ]
      }]
      ;

    this.http.post(link_sync, myData)
      .subscribe(data => {
        if (JSON.parse(data["_body"]).code == 200) {
          console.log("Data Inserted Successfully");
        }
        else
          console.log("Error", JSON.parse(data["_body"]).code == 200);

        console.log(JSON.parse(data["_body"]).message);
      }, error => {
        console.log(error.error);
      });


  }

  synchDataToServerUseService() {
    var listOfTable = ["producer_measurements"];
    var self = this;
    this.retrieveDB(listOfTable)
      .then(function (value) {
        self.authService.postData(value, "sync_data_app").then((result) => {
          self.responseData = result;
          if (JSON.parse(result["code"]) == 200) {
            // If data is synch successfully, update isSent=1 //
            self.updateIsSentColumn();
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
  }

  signIn() {
    console.log(JSON.stringify(this.userData));
    /*this.authService.postData(this.userData,this.link).then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      localStorage.setItem('userData',JSON.stringify(this.responseData));

    }, (err) => {
    // Connection fail
    console.log(JSON.stringify("err = "+err));
    });*/
    this.http.post(this.link, this.userData)
      .subscribe(data => {
        if (JSON.parse(data["_body"]).code == 200) {
          console.log("Login Successfully");
        }
        else
          console.log("Error", JSON.parse(data["_body"]).code == 200);

        console.log(JSON.parse(data["_body"]).message);
        // console.log(data["_body"]);
        // this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

        // console.log(this.data.response);
        // if(data["_body"]=="")
        // {

        // }
        // 
      }, error => {
        console.log(error.error);
      });
  }

  retrieveDB(listOfTable: string[]) {
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
              console.log('_data = ' + JSON.stringify(_data));

              callback(null, _data);
            }
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
          console.log(JSON.stringify(data_return));
        }
      });
    });

    return pro;
  }

  old_retrieveDB(listOfTable: string[], listOfFieldToBeChecked: string[]) {
    // var _data = {
    //     "producer_measurements": []
    //   };
    var data_return = [];
    var _data = {};
    var self = this;

    var pro = new Promise(function (resolve, reject) {
      listOfTable.forEach(element => {
        _data[element] = [];
        var colNames = [];

        this.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql("PRAGMA table_info('producer_measurements')", {})
            .then(resColNames => {
              for (var index = 0; index < resColNames.rows.length; index++) {
                colNames[index] = resColNames.rows.item(index).name;
              }
            }).catch(e => { console.log(e) });
        });
        alert('colNames = ' + colNames);
        // Retrieve All Offline data from table producer_measurements //
        self.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM producer_measurements where isSent=?', [0])
            .then(resOfflineRecords => {
              //console.log(resOfflineRecords["result"]);
              // For each offline record //
              for (var i = 0; i < resOfflineRecords.rows.length; i++) {
                console.log(i);
                console.log(resOfflineRecords.rows.item(i)); // ERROR: is not a function
                //console.log(resOfflineRecords.rows.items(i).id);  // ERROR: is not a function
                // var eachData = JSON.stringify(resOfflineRecords.rows.item(i).facility_id);
                var eachData = resOfflineRecords.rows.item(i);
                //console.log(JSON.stringify(eachData.facility_id));
                // Retrieve All Columns Name From table producer_measurements //

                //console.log(resColNames);
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
                eachData.measurement_8];
                var col = null;
                var obj = {};
                for (var j = 0; j < colNames.length; j++) {
                  // Construct JSON string with key (column name)/value (offline data) pair //
                  col = colNames[j];
                  obj[col] = valFromTable[j];
                }
                _data[element].push(obj);
                //data_return[i].push(_data);
                console.log('_data = ' + JSON.stringify(_data));

                data_return.push(_data);



                //console.log(resOfflineRecords.rows.item(i).name);

              } // for i
              resolve(data_return);
              //console.log("above return "+JSON.stringify(_data));
              //return _data;
            }).catch(e => { console.log(e) });
        })
      }); // End foreach
    });

    return pro;

  }
} // End class

