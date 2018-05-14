import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import {HomePage} from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   //rootPage:any = HomePage;
 rootPage:any;
 userRole:number;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      var localStorage_userData = JSON.parse(localStorage.getItem("userData"));
      if(localStorage_userData != null)
      {
        this.rootPage = HomePage;
      }
      else
      {
        this.rootPage = LoginPage;
      }
        
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

