import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Product } from 'src/app/components/products/product.interface';
import { ProductsService } from 'src/app/components/products/products.service';


@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<Product> {
  constructor(private router: Router, private productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log('product id', route.params.id)
    return this.productsService.getProductById(JSON.parse(route.params.id))
      .pipe(
        take(1),
        map(product => {
        // console.log(product)
        if (!product) {
          const profile = JSON.parse(localStorage.getItem('admin_profile'))
          this.router.navigate([`${profile.firstname}/products/physical/product-list`]);
        } else {
          return of(product)
        }
      })
      )
  }
}
