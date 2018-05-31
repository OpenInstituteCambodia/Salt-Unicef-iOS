import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';

// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabase } from 'angularfire2/database';
// // import * as firebase from 'firebase/app';
// //import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import async from 'async';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { HomePage } from '../home/home';
import { ProducerPage} from '../producer/producer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getCurrentDebugContext } from '@angular/core/src/view/services';


@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {
  responseData: any;
  monitorID: number = 0;
  producerID: number = 0;
  measurementDate: string = "";
  isAtProducer: number = 0;
  location: string = "";
  measurement: number = 0;
  warningOrNot: number = 0;
  followUpDate: string = "";
  monitor_name: string = "";
  monitorMeasurementData = { "monitor_id": "", "facility_id": "", "at_producer_site": "", "location": "", "latitude": "", "longitude": "", "measurement": "", "warning": "", "date_of_visit": "", "date_of_follow_up": "" };
  list_facilities = this.listOfFacilities();
  selectedFacilityId = null;
  currentDate: any;
  listOfAllTable = ["monitor_measurements","producer_measurements"];
  hasOffline:number;

  monitorValidate: FormGroup;
  submitAttempt: boolean = false;
  facility = {"id":0 ,"facility_ref_id":"","facility_name":""};
  locDisabled:boolean = true;

  constructor(private network: Network,
    private alertCtrl: AlertController,
    private toast: Toast,
    // private fire: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private app: App,
    private sqlite: SQLite,
    public authService: AuthServiceProvider,
    public formBuilder: FormBuilder) {
    //console.log(this.navParams);
    var localStorage_userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData = " + JSON.stringify(localStorage_userData));
    this.monitorMeasurementData.monitor_id = localStorage_userData.id;
    this.monitorMeasurementData.facility_id = this.selectedFacilityId;
    console.log("this.monitorMeasurementData.facility_id = " + JSON.stringify(this.monitorMeasurementData.facility_id));
    this.monitor_name = localStorage_userData.name;
    //console.log("this.monitorMeasurementData.monitor_id = "+this.monitorMeasurementData.monitor_id);
    //this.listOfFacilities();
    platform.ready().then(() => {
      //Registration of push in Android and Windows Phone
      platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        console.log('Back is click')
        if (nav.canGoBack()) { //Can we go back?
          nav.popToRoot();
        } else {
          this.platform.exitApp(); //Exit from app
        }
      });
    });
    /*
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        //alert("Connected");
        this.synchMonitorDataToServerUseService();
        connectSubscription.unsubscribe();
      }, 0);
    });
    */

    if (this.network.type != "none") {
      console.log("Network connected in requestToUpdateFacility");
      this.requestToUpdateFacility();
    }

   this.monitorValidate = formBuilder.group({
    //usr: ['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]'{'2,4'}'$")])],
    monitorName: ['',Validators.required],
    facilityId: ['',Validators.required],
    measureDate: ['',Validators.required],
    atProducer: ['',Validators.required],
    measure: ['',Validators.required],
    warning: ['',Validators.required],
    dateFollowUp: ['',Validators.required]
  });
  }

  createTableMonitor() {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS monitor_measurements (monitor_id INT, facility_id INT, at_producer_site INT, location TEXT, latitude TEXT, longitude TEXT, measurement INT, warning INT, date_of_visit TEXT,date_of_follow_up TEXT, isSent INT)', {})
        .then(res => console.log('execuated SQL in createTableMonitor!'))
        .catch(e => console.log(e));
    })
  }

  
  // creating alert dialog
  alert(message: string) {
    this.alertCtrl.create({
      title: 'Info',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  saveMonitorData() {
    this.submitAttempt = true;

    if(this.monitorValidate.valid)
    {
      this.sqlite.create({
        name: 'unicef_salt',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(' INSERT INTO monitor_measurements (monitor_id, facility_id, at_producer_site, location, latitude, longitude, measurement, warning,date_of_visit,date_of_follow_up, isSent) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
          [this.monitorMeasurementData.monitor_id, this.selectedFacilityId, this.monitorMeasurementData.at_producer_site, this.monitorMeasurementData.location, this.monitorMeasurementData.latitude, this.monitorMeasurementData.longitude,
          this.monitorMeasurementData.measurement, this.monitorMeasurementData.warning, this.monitorMeasurementData.date_of_visit, this.monitorMeasurementData.date_of_follow_up, 0])
          .then(res => {
            
            if (this.network.type == "none") {
              console.log('Data Inserted into monitor_measurements!');
              this.authService.presentLoadingCustom(2000, "Saving data offline ...");
              this.authService.hasOfflineData("monitor_measurements",HomePage);
            }
            else {
              this.authService.synchDataToServerUseService(HomePage,"monitor_measurements");//=> working fine
              this.authService.presentLoadingCustom(6000, "Saving data ...");
              
            }
          })
          .catch(e => console.log(e));
      })
    }
    else
      this.authService.presentToast("The fields with asterike (*) are required");
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorPage');
    console.log("userData = " + JSON.stringify(localStorage.getItem("userData")));
    console.log("locDisabled = "+this.locDisabled);
    //this.createTableMonitor();
  }

  ionViewWillEnter() {
    this.createTableMonitor();
    this.currentDate = new Date().toISOString();
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

            var resColNames = await db.executeSql("PRAGMA table_info('" + tableName + "')", {});

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
            var resOfflineRecords = await db.executeSql('SELECT * FROM monitor_measurements where isSent=?', [0])
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
          console.log(JSON.stringify(data_return));
        }
      });
    });

    return pro;
  }

  /* listOfFacilities() {
    this.authService.getData("list_facilities_app").then((result) => {
      console.log("result = " + JSON.stringify(result));
      console.log("result of facilities = " + JSON.stringify(result["facilities"]));
      this.list_facilities = result["facilities"];

      console.log("list_facilities = " + JSON.stringify(this.list_facilities));
    }, (err) => {
      // Connection fail
      console.log(JSON.stringify("err = " + err));
    }).catch((e) => {
      console.log('Error in listOfFacilities:' + e);
    });
  } */

   listOfFacilities() {
    var arr_facilities = [];
    try {
      this.sqlite.create({
        name: 'unicef_salt',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM facilities', [])
        .then(resFacilities => {
          for (var i = 0; i < resFacilities.rows.length; i++) {
            arr_facilities.push(resFacilities.rows.item(i));
          } 
          
        }).catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    } catch (err) {
      console.log(err);
    }
    console.log("arr_facilities = "+arr_facilities);
    return arr_facilities;
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
          //db.executeSql('SELECT count(isSent) as totalCount FROM '+ tableName +' where isSent=?', [0])
          db.executeSql('SELECT sum(case when isSent=0 then 1 else 0 end) as totalCount FROM monitor_measurements' , [])
            .then(res => {
              console.log("res = "+JSON.stringify(res));
              var num_offline_records = res.rows.item(0).totalCount;
              localStorage.setItem("offline",(num_offline_records).toString());
              console.log('num_offline_records before if = '+' of '+tableName +' = '+num_offline_records);
              if(num_offline_records>0)
              {
                localStorage.setItem("offline",(num_offline_records).toString());
                console.log('num_offline_records in if = '+' of '+tableName +' = '+num_offline_records);
                //this.hasOffline = num_offline_records;
                console.log('offline in localStorage = ' + localStorage.getItem("offline"));
                console.log('toStr of 1 = ' + (1).toString());
                console.log('toStr of 2 = ' + (2).toString());
              }
              this.goToHomePage();
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
      }
    } 
  }

  goToHomePage(){
    this.navCtrl.push(HomePage);
    //this.hasOfflineData(this.listOfAllTable);
  }

  /* 
  synchMonitorDataToServerUseService() {
    var listOfTable = ["monitor_measurements"];
    var self = this;
    this.retrieveDB(listOfTable)
      .then(function (value) {
        self.authService.postData(value, "sync_data_app").then((result) => {
          self.responseData = result;
          if (JSON.parse(result["code"]) == 200) {
            // If data is synch successfully, update isSent=1 //
            self.updateIsSentColumn('monitor_measurements');
            //self.hasOfflineData(listOfTable);
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
  updateIsSentColumn(tblName: string) {
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE '+ tblName +' SET isSent=? WHERE isSent=0', [1])
        .then(res => {
          console.log('Data Updated!');
          this.hasOfflineData(this.listOfAllTable);
        })
        .catch(e => console.log(e));
    })
  }

  

  */

  // Creator: SAMAK //
    // Function to request and update latest order questions //
    requestToUpdateFacility()
    {
      // TO-DO by Samak using API #6//
      // Send request from App with params: 1. total no. of records, 2. last downloaded date to get order quiz data from server
      // if total no. of records in order_questions == that of server,
      //  Server returns only the updated records recognized by in App modified_date, in Server updated_date
      // else => the total no. of records is different, then
      //  replace all records in App.
      console.log("here in totalNoOfFacility");
      var self = this;

      this.totalNoOfFacility()
        .then(function(value) {
          //self.listOfFacilities();
          console.log("value of postData ="+value);
          self.authService.postData(value,"get_updated_facility_lists_app").then((result) => {
            console.log("here in postData");
            self.responseData = result;
            console.log("Data Inserted Successfully in get_updated_facility_lists_app = "+JSON.stringify(self.responseData));
            var codeReturn = JSON.parse(result["code"]);
              console.log("codeReturn = "+codeReturn);
            if(codeReturn==200) 
            {
              // If data is synch successfully, update isSent=1 //
              //console.log("Data Inserted Successfully = "+JSON.parse(JSON.parse(result["equal"])));

              var equalReturn = JSON.parse(result["equal"]);
              console.log("equalReturn = "+equalReturn);
              switch(equalReturn)
              {
                case 1: // num_q is equal, update order_questions by id
                  var objOrderQuestion = result["data"];
                  console.log("data = "+objOrderQuestion);
                  objOrderQuestion.forEach(item =>{
                    self.updateFacility(item["id"],item["facility_ref_id"],item["facility_name"],item["Latitude"], item["Longitude"], item["updated_at"]);
                    
                  });
                  console.log("Updated!");
                  
                  break;
                case 0: // num_q is not equal, replace a whole order_questions table
                  var objOrderQuestion = result["data"];
                  self.truncateTableFacility("facilities",objOrderQuestion);
                  
                  break;
              }
            
            }
            else
              console.log("Synch Data Error");
            console.log("response = "+JSON.stringify(self.responseData));
          }).catch((e) => {
            console.log('catch in postData:' + e);
          });
        })
        .catch((e) => {
          console.log('catch in totalNoOfFacility:' + e);
        }); 
      // ======END OF API #6 ======== //
    }

    // Creator: SAMAK //
  // Function to query no. of order questions and last_download_date from order_questions table, 
  // for sending request for new order question from Server//
  totalNoOfFacility(){
    //var data_return = [];
    console.log("here in totalNoOfFacility");
    var _data = {
      "number_of_records":"",
      "last_download_date":""
    };
    var self = this;
    var asyncTasks = [];
    var number_of_records ="number_of_records";

    var pro = new Promise(function(resolve, reject) {
        var subTasks = [];
        
        // Task to count total number of records in order_questions table
        subTasks.push(async function(callback) {
          var colNames = [];
  
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });
            
            var resColNames = await db.executeSql("SELECT count(*) as total FROM facilities",{});
             
            let num_q = resColNames.rows.item(0).total;
            _data['number_of_records']=num_q;
            callback(null, num_q);
          } catch (err) {
            console.log(err);
          }
        });
  
        // Task to max date from order_questions table
        subTasks.push(async function(callback) {
          //console.log('num_q: ' + num_q);
          try {
            var db = await self.sqlite.create({
              name: 'unicef_salt',
              location: 'default'
            });
            var resMaxDate = await db.executeSql('SELECT MAX(updated_at) as max_date FROM facilities',{})
            console.log('resMaxDate: ' + resMaxDate);
            let maxDate = resMaxDate.rows.item(0).max_date;
            if(maxDate==null)
              maxDate= new Date().toISOString();
            console.log('maxDate: ' + maxDate);
            _data['last_download_date']=maxDate;
            callback(null, _data);
          } catch (err) {
            console.error(err);
          }
        });
            
      async.series(subTasks, function(err, data) {
        try {
          if (err) {
            console.error(err);
          } else {
            resolve(_data);
            console.log(JSON.stringify(_data));
          }
        } catch (err) {
          console.log(err);
        }
      });
    });

    return pro;
  }

  // Creator: SAMAK //
  // Function to update a few records of order questions table//
  updateFacility(id: number, facility_ref_id:string,facility_name:string,Latitude: string, Longitude: string, updated_date:any){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('UPDATE facilities SET facility_ref_id=?, facility_name=?, Latitude=?, Longitude=?, updated_date=? WHERE id=?', [facility_ref_id,facility_name,Latitude,Longitude,updated_date,id])
      .then( res => {
        console.log('Data Updated!');
      })
      .catch((e) => {
        console.log('Catch in Update order_questions:' + e);
      });
    })
    .catch((e) => {
      console.log('Catch in updateOrderQuestion:' + e);
    });
  }

  // Creator: SAMAK //
  // Function to replace the whole order questions table//
  replaceIntoFacility(id: number,facility_ref_id:string,facility_name:string,Latitude: string, Longitude: string, created_date:any, updated_date:any){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('TRUNCATE TABLE facilities',[])
      .then( res => {
        console.log('Data REPLACED!');
      })
      .catch((e) => {
        console.log('Catch in TRUNCATE:' + e);
      });

      db.executeSql('INSERT INTO facilities(id, facility_ref_id, facility_name, Latitude, Longitude, created_at, updated_at) VALUES (?,?,?,?,?,?,?)',[id, facility_ref_id, facility_name, Latitude, Longitude, created_date, updated_date])
      .then( res => {
        console.log('Data REPLACED!');
      })
      .catch((e) => {
        console.log('Catch in replaceIntoFacility:' + e);
      });
    })
  }

  // Creator: SAMAK //
  // Function to replace the whole order questions table//
  truncateTableFacility(tableName:string, objOrderQuestion: any){
    var self = this;
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('DELETE FROM facilities',[])
      .then( res => {
        objOrderQuestion.forEach(item =>{
          console.log("Replace insert item = "+item["id"]);
          this.replaceIntoFacility(item["id"],item["facility_ref_id"],item["facility_name"],item["Latitude"], item["Longitude"], item["created_at"], item["updated_at"]);
        });
        this.list_facilities = this.listOfFacilities();  
      })
      .catch((e) => {
        console.log('Catch in TRUNCATE:' + e);
      });
    })
  }

  atProducerSelect(val: number)
  {
    //alert(val);

    if(val == 1)
    {
      this.locDisabled = true;
      console.log("val in if = "+val);
      this.monitorMeasurementData.location="";
    }
      
    else
    {
      this.locDisabled = false;
      console.log("val in else = "+val);
    }
  }
  
}