import { Component } from '@angular/core';
<<<<<<< HEAD
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import {AngularFireDatabase} from 'angularfire2/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Toast } from '@ionic-native/toast';

=======
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
>>>>>>> 7c7fbda0c7d9f1837c5efab04cf43eda71eff6b9

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
  //reportNo: string ='1';
  //facilityId: string = '';
  producerName: string ='';
  MeasurementDate: string ='';
  saltProducedToday: string ='';
  potassiumUsedToday: string ='';
  potassiumInStock: string ='';
  measurement1: string ='';
  measurement2: string ='';
  measurement3: string ='';
  measurement4: string ='';
  measurement5: string ='';
  measurement6: string ='';
  measurement7: string ='';
  measurement8: string ='';

  /*
  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.producerName = this.navParams.get('producerName');
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

  saveMeasurement()
  {
    this.db.list('/procedureTable').push({
      producerName: this.producerName,
      MeasurementDate: this.MeasurementDate,
      saltProducedToday: this.saltProducedToday,
      potassiumUsedToday: this.potassiumUsedToday,
      potassiumInStock: this.potassiumInStock,
      measurement1: this.measurement1,
      measurement2: this.measurement2,
      measurement3: this.measurement3,
      measurement4: this.measurement4,
      measurement5: this.measurement5,
      measurement6: this.measurement6,
      measurement7: this.measurement7,
      measurement8: this.measurement8,
    }).then(() => {
      // save data
      this.alert("Successfully Saved");
      this.navCtrl.push(ProducerPage);
    });
  }
  */
 // Update on 12-03-2018 by Samak //
 constructor(public navCtrl: NavController, private sqlite: SQLite, private toast: Toast, public navParams: NavParams) {
  this.producerName = this.navParams.get('producerName');
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
 }

  ionViewDidLoad() {
    this.createTable();
    //console.log('ionViewDidLoad ProducerPage');
  }

  ionicViewWillEnter(){
    this.createTable();
  }

  createTable(){
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('CREATE TABLE IF NOT EXISTS producerTable (id INTEGER PRIMARY KEY, producerName TEXT, measurementDate TEXT, potassiumInStock INT, potassiumUsedToday INT, saltProducedToday INT, measurment1 INT, measurment2 INT,measurment3 INT,measurment4 INT,measurment5 INT,measurment6 INT,measurment7 INT, measurment8 INT)', {})
      .then( res => console.log('execuated SQL'))
      .catch(e => console.log(e));
    })
  }

  saveMeasurement(){
    this.toast.show('Button Clicked !', '5000', 'center').subscribe(
      toast => {
        this.navCtrl.popToRoot();
      }
    );
    this.sqlite.create({
      name: 'unicef_salt',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql(' INSERT INTO producerTable (producerName, measurementDate, potassiumInStock, potassiumUsedToday, saltProducedToday, measurment1, measurment2,measurment3,measurment4,measurment5,measurment6,measurment7, measurment8) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.producerName, this.MeasurementDate,this.potassiumInStock, this.potassiumUsedToday,this.saltProducedToday,this.measurement1, this.measurement2, this.measurement3, this.measurement4, this.measurement5, this.measurement6, this.measurement7, this.measurement8])
      .then( res => {
        console.log('Data Inserted !');
        this.toast.show('Data saved', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      })
      .catch(e => console.log(e));
    })
  }

}
