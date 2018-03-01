import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

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

  constructor(public db: AngularFireDatabase, private alertCtrl:AlertController, 
    public navCtrl: NavController, public navParams: NavParams, 
    private platform: Platform, private app: App) {
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

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad ProducerPage');
  }

}
