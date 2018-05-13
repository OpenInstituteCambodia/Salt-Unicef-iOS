import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'; 
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

let apiUrl = "http://salt.open.org.kh/api/";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http,
    private sqlite: SQLite) {
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

  hasOfflineData(listOfAllTable: string[], sqliteDb: SQLite)
  {
    var self = this;
    console.log("listOfAllTable.length= "+listOfAllTable.length);
    for (var i=0; i<listOfAllTable.length; i++) {
      try {
        self.sqlite.create({
          name: 'unicef_salt',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT count(*) as total FROM '+ listOfAllTable[0] +' where isSent=?', [0])
            .then(res => {
              let num_offline_records = res.rows.item(0).total;
              console.log('num_offline_records = '+' of '+listOfAllTable[0] +' = '+num_offline_records);
              if(num_offline_records>0)
              {
                localStorage.setItem("offline",num_offline_records.toString());
              }
              
            })
            .catch(e => console.log(e));
        })
      } catch (err) {
        console.log(err);
      }
    }
  }
 
}
