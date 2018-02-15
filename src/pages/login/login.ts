import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MonitorPage } from '../monitor/monitor';
import { ProducerPage } from '../producer/producer';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  openProducerPage()
  {
    this.navCtrl.push(ProducerPage);
  }

  openMonitorPage()
  {
    this.navCtrl.push(MonitorPage);
  }

}