import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data/data.service';
import { environment } from 'src/environments/environment';
import { Product } from './product.interface';

const state = {
  products: JSON.parse(localStorage['products'] || '[]')
}
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  Products: Observable<Product[]>;

  constructor(private dataService: DataService, private http: HttpClient) { }
  private get products() {

    if (environment.production) {
      this.Products = this.dataService.products
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      }))
    } else {
      /* For Development Only */
      this.Products = this.dataService.testProducts
        .snapshotChanges()
        .pipe(map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        }))
    }
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));

  }

  public getProducts(): Observable<Product[]> {
    return this.products;
  }

  public getProductsRef() {
    if (environment.production) {
      return this.dataService.products;
    } else {
      return this.dataService.testProducts;
    }
  }

  public getProductById(id: number) {
    return this.getProducts()
      .pipe(
        map(products => {
          const product = products.filter(product => product.id === id)
          return product[0]
        })
      )
  }

  public getNewProductId() {
    let id;
    this.getProducts().subscribe(products => id = products.length + 1)
    return id;
  }

  public addProduct(product: Product) {
    const id = product.id - 1;
    return this.dataService.addProductToDatabase('test-products', id, product)
  }

  public removeProduct(product: Product) {
    return this.getProductsRef().remove(product.key)
  }

  public editProduct(product: Product) {
    return this.getProductsRef().update(product.key, product)
  }
}
