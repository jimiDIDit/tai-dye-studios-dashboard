import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data/data.service';
import { productDB } from 'src/app/shared/tables/product-list';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public product_list: any;

  constructor(private dataService: DataService) {
    dataService.products.valueChanges().subscribe(products => {
      this.product_list = products;
    })
  }

  ngOnInit() {}


}
