import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data/data.service';
import { productDB } from 'src/app/shared/tables/product-list';
import { environment } from 'src/environments/environment';
import { Product } from '../../product.interface';
import { ProductsService } from '../../products.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public adminRole = '';
  public product_list: any;
  private Products: Observable<Product[]>
  constructor(private router: Router, public modalService: NgbModal, private productsService: ProductsService, private dataService: DataService) {
  }


  editProduct(product: Product, content) {
    if (this.adminRole !== 'ADMIN') {
      return this.openModal(content).result.then(() => null, dismissed => {
        console.log(dismissed)
      })
    } else {
      this.router.navigate(['/u/products/physical/product-detail/' + product.id])
    }
  }

  deleteProduct(product, content) {
    this.openModal(content).result.then(results => {
      if (results) {
        this.productsService.removeProduct(product);
      }
    }, dismissed => {
      console.log('Product Delete Cancelled', dismissed)
    })
  }

  openModal(content) {
    return this.modalService.open(content, {
      size: 'sm',
      centered: true,
      backdrop: 'static',
    })
  }

  discount(price, discount) {
    if (!discount) return;
    const disc = +Number(`0.${discount}`);
    const priceDivDiscount = +Number(price * disc);
    return (price - priceDivDiscount);
  }

  ngOnInit() {
    const { role } = JSON.parse(localStorage.getItem('admin_profile'));
    this.adminRole = role;
    this.productsService.getProducts().subscribe(products => {
      this.product_list = products;
    })
  }


}
