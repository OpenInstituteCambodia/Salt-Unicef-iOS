import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProducerPage } from './producer';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    ProducerPage,
  ],
  imports: [
    IonicPageModule.forChild(ProducerPage),
    Network
  ],
})
export class ProducerPageModule {}
