import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/components/products/product.interface';
import { AdminProfile } from '../profile/profile.service';

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

  public get team() {
    return this.Team = this.getCollection<AdminProfile>('admins');
  }

  public get reports() {
    return this.Reports = this.getCollection('reports');
  }

  public get marketing() {
    return this.Marketing = this.getCollection('marketing');
  }

  public get coupons() {
    return this.Coupons = this.getList('coupons');
  }

  public get settings() {
    return this.Settings = this.getCollection('settings');
  }

  public get customers() {
    return this.Customers = this.getCollection('users');
  }

  public get vendors() {
    return this.Vendors = this.getCollection('vendors');
  }

  public get products() {
    return this.Products = this.getList<Product>('products');
  }

  public addProductToDatabase(listName: string, id: number | string, item: any) {
    this.db.object(`${listName}/${id}`).set(item);
  }

  public get testProducts() {
    return this.Products = this.getList<Product>('test-products');
  }

  public getCollection<T = any>(name: string) {
    return this.afs.collection<T>(name);
  }

  public getLocalCollection(name: string) {
    return state[name];
  }

  public getList<T = any>(name: string) {
    return this.db.list<T>(name);
  }

}
