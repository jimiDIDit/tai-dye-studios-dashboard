import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fromTask } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, InitialNavigation, Router, RouterEvent, ActivatedRoute } from '@angular/router';
import { CKEditorComponent } from 'ngx-ckeditor';
import { Observable } from 'rxjs';
import { filter, finalize, map, tap } from 'rxjs/operators';
import { MediaService } from 'src/app/core/services/media/media.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ToastsService } from 'src/app/shared/service/toasts.service';
import { Product, Image, Variant } from '../../product.interface';
import { ProductsService } from '../../products.service';

export interface PhotoURL {
  [key: string]: any;
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  @ViewChild('uploadErrorModal', { static: true }) UploadErrorModal: TemplateRef<any>;
  @ViewChild('saveOrDiscard', { static: true }) SaveOrDiscardModal: TemplateRef<any>;
  @ViewChild('addVariantModal', { static: true }) AddVariantModal: TemplateRef<any>;
  @ViewChild('warningToast', { static: true }) WarningToast: TemplateRef<any>;
  public productForm: FormGroup;
  public photoUrls: PhotoURL[] = [];
  public productType: string = 'tshirts';
  public uploadProgress: any;
  public selectedImage: any;
  public uploadErrorMsg = '';
  public variant: FormGroup;
  public product: Product = {
    tags: [],
    collection: [],
    images: [],
    variants: [],
  };
  public mediaUploadConfig = {};
  saving: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private modalService: ModalService, private productsService: ProductsService, private media: MediaService, private toasts: ToastsService) {
  }

  public addProduct(product: Product, photoUrls: PhotoURL[]) {
    console.log(photoUrls)
    this.saving = true;
    product.id = this.productsService.getNewProductId();
    product.new = true;
    product.sale = product.collection.includes('on sale');
    product.images = this.addSavedMedia(photoUrls);

    console.log('Adding Product', product)
      this.productsService.addProduct(product);
      setTimeout(() => {
        this.saving = false;
        this.discard(product);
        this.router.navigate(['/u/products/physical/product-list'])
      }, 0)
  }

  public addProp(property, product, propVal) {
    product[property] = propVal;
  }

  public addSavedMedia(saved: any[]) {
    console.log('Event Emitter', saved)
    return saved.map((img, idx) => {
      console.log('saved media', img)
      const id = this.productsService.getNewProductId();
      const image: Image = {
        id,
        alt: img.alt,
        src: img.url,
        image_id: +Number(`${id}${idx}`),
        variant_id: [idx]
      };
      return image
      // this.photoUrls.push(image);
      // console.log('Added Saved Media Item', img)
    }).sort((a: any, b: any) => {
      return b - a;
     })
    // this.selectedImage = this.photoUrls[0]
  }

  public addVariant(product, content) {
    this.modalService.open(content, {size: 'md'})
      .result.
      then(results => {
        const idx = product.variants.length;
        const variant = this.buildVariant(product, results, idx)
        product.variants.push(variant);
    }, dismissed => console.log(dismissed))
  }

  public deleteVariant(product: Product, variantIdx: number) {
    const variant: Variant[] = product.variants.splice(variantIdx, 1);
    this.toasts.show(this.WarningToast, {
      classname: 'bg-danger text-light',
      delay: 10000,
    });
  }

  public discard(product) {
    const keys = Object.keys(product).map(key => {
      product[key] = null;
    })
    this.photoUrls = [];
    this.productForm.reset();
    this.variant.reset();
    this.selectedImage = null;
  }

  public displayTags(e, product, property) {
    product[property] = e;
    console.log('Tags', e)
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.productForm.pristine || !this.photoUrls.length) {
      return true;
    }
    return this.modalService.openForDeactivate(this.SaveOrDiscardModal, {
      size: 'sm',
      backdrop: 'static'
    })
  }

  public viewImage(img, i) {
    this.selectedImage = img;
  }

  private buildVariant(product: Product, config: { color: string, size: string, price: number }, idx: number) {
    const title = product.type.substring(0, 1).toUpperCase();
    const id = product.id ? product.id : this.productsService.getNewProductId();
    return {
      price: config.price,
      size: config.size,
      color: config.color,
      id,
      image_id: +Number(`${id}${idx}`),
      variant_id: +Number(`${id}0${idx}`),
      sku: `${title}${id}21-${config.size}`.toUpperCase()
    }
  }
  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['Really Cool Title', [Validators.required]],
      category: ['clothing', [Validators.required]],
      brand: ['none', [Validators.required]],
      type: ['tshirt', [Validators.required]],
      price: [0, [Validators.required]],
      stock: [100, [Validators.required]],
      discount: [0, [Validators.required]],
      description: ['Cannot Be Greater!', [Validators.required]],
    })
    this.variant = this.fb.group({
      price: [22],
      size: ['s'],
      color: ['dodgerblue'],
    })
    this.mediaUploadConfig = {
      appenUploadToExisting: false,
      folder: this.productForm.value['type'],
      parentFolder: 'test-products',
      path: 'test-products/' + this.productForm.value['type']
    }
  }

  ngOnDestroy() {
    this.discard(this.product);
  }

}
