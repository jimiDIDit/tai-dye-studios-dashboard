import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DataState {
  [name: string]: any;
}
const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  customers: JSON.parse(localStorage['customers'] || '[]'),
  team: JSON.parse(localStorage['team'] || '[]'),
  sales: JSON.parse(localStorage['sales'] || '[]'),
  coupons: JSON.parse(localStorage['coupons'] || '[]'),
  marketing: JSON.parse(localStorage['marketing'] || '[]'),
  reports: JSON.parse(localStorage['reports'] || '[]'),
  settings: JSON.parse(localStorage['settings'] || '[]'),
  vendors: JSON.parse(localStorage['vendors'] || '[]'),
  media: JSON.parse(localStorage['media'] || '[]'),
  local: JSON.parse(localStorage['local'] || '[]'),
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public Sales: any;
  public Products: any;
  public Customers: any;
  public Team: any;
  public Coupons: any;
  public Marketing: any;
  public Reports: any;
  public Settings: any;
  public Vendors: any;
  public Media: any;
  public Local: any;

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private http: HttpClient) { }

  public get sales() {
    return this.Sales = this.getCollection('orders')
  }

  public get products() {
    return this.Products = this.getList('products');
  }

  public getCollection(name: string) {
    return this.afs.collection(name);
  }

  public getList(name: string) {
    return this.db.list(name);
  }

}
