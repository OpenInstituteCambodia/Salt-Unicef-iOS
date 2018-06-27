import { NgModule } from '@angular/core';
//import { IonicPageModule } from 'ionic-angular';
//import { MonitorPage } from './monitor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    // MonitorPage,
  ],
  imports: [
   // IonicPageModule.forChild(MonitorPage),
    TranslateModule.forChild()
  ],
})
export class MonitorPageModule {}
