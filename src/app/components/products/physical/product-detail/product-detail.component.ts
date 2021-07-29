import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbToast,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Data } from '@angular/router';
import { Image, Product, Variant } from '../../product.interface';
import { Observable, of } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../products.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ToastsService } from 'src/app/shared/service/toasts.service';
import { MediaService } from 'src/app/core/services/media/media.service';
import { UploadConfig } from 'src/app/shared/components/image-upload/image-upload.component';

export declare type SelectedVariant = {
  variant_id?: number;
  price?: any;
  size?: string;
};

export interface EditConfig {
  [key: string]: any;
  property?: string;
  propType?: any;
  propVal?: any;
  product?: Product;
  formGroup?: FormGroup;
  formControl?: FormControl;
  controlType?: string;
  variant?: any;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [NgbRatingConfig],
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('dangerToast', { static: false }) DangerToast: TemplateRef<any>;

  @ViewChild('saveOrDiscard', { static: true })
  SaveOrDiscardModal: TemplateRef<any>;
  public closeResult: string;
  public counter: number = 1;
  public product: Observable<Product>;
  public selectedVariant: SelectedVariant = {};
  public editConfig: EditConfig = {};
  public editForm: FormGroup;
  public uploadErrorMsg: string;
  public photos: any;
  public replaceImages: boolean = true;
  public selectedColorToEdit: any;
  public mediaUploadConfig: UploadConfig = {
    appendUploadToExisting: true,
    folder: 'tshirt',
    parentFolder: 'test-products',
    path: 'test-products/tshirt',
  }
  public selectedImage: Image;
  variant: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: ModalService,
    ratingConfig: NgbRatingConfig,
    private toast: ToastsService,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private media: MediaService
  ) {
    // ratingConfig.max = 5;
    // ratingConfig.readonly = true;
    this.route.data.subscribe((resolvedData) => {
      this.product = resolvedData.data;
    });
    this.variant = this.fb.group({
      price: [22],
      size: ['s'],
      color: ['dodgerblue'],
    })
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.editConfig.formGroup || this.editConfig.formGroup.pristine) {
      return true;
    }

    return this.modalService.openForDeactivate(this.SaveOrDiscardModal, {
      size: 'sm',
      backdrop: 'static',
    });
  }

  Colors(variants: Variant[]) {
    let colors = [];
    variants.map((variant) => {
      if (!colors.includes(variant.color)) colors.push(variant.color);
    });
    return colors;
  }

  Sizes(variants: Variant[]) {
    let sizes = [];
    variants.map((variant) => {
      if (!sizes.includes(variant.size)) sizes.push(variant.size);
    });
    return sizes;
  }

  selectVariantBySize(size: string, variants: Variant[]) {
    return variants
      .filter((variant) => variant.size === size)
      .map((variant) => ({
        size: variant.size,
        variant_id: variant.variant_id,
        price: variant.price,
      }))
      .map((variant: SelectedVariant) => (this.selectedVariant = variant))[0];
  }

  edit(property: string, product: Product, content: any, idx?: number) {
    const config: EditConfig = this[property](product, idx);
    this.modalService
      .open(content, {
        size: 'md',
        centered: true,
        backdrop: 'static',
      })
      .result.then(
        (results) => {
          console.log(results);
          if (!results) return;
          config.save(results)
          config.formGroup.reset();
        },
        (dismissed) => {
          if (config.hasOwnProperty('cancel')) {
            config.cancel();
          }
          console.log('Edit Modal Dismissed:', dismissed);
        }
      );
  }

  viewImage(selected: any) {
    this.selectedImage = selected;
  }

  deleteTag(property: string, product: Product, idx: number) {
    product[property].splice(idx, 1);
    this.productService.editProduct(product);
  }

  private collection(product: Product) {
    const propVal = product.collection;
    return (this.editConfig = {
      property: 'collection',
      propType: typeof propVal,
      product,
      formGroup: this.fb.group({
        collection: new FormControl(propVal || [])
      }),
      controlType: 'array',
      add: (e: any) => {
        console.log(propVal)
        product.collection = [...propVal, ...e];
        this.editConfig.formGroup.controls['collection'].patchValue(product.collection)
      },
      cancel: () => {
        product.collection.pop();
      },
      save: (results: any) => {
        product.collection = results.collection;
        this.productService.editProduct(product);
      }
    })
  }

  private tags(product: Product) {
    const propVal = product.tags;
    return (this.editConfig = {
      property: 'tags',
      propType: typeof propVal,
      product,
      formGroup: this.fb.group({
        tags: new FormControl(propVal || [])
      }),
      controlType: 'array',
      add: (e: any) => {
        console.log(e)
        product.tags = [...propVal, ...e];
        this.editConfig.formGroup.controls['tags'].patchValue(product.tags)
      },
      cancel: () => {
        product.tags.pop();
      },
      save: (results: any) => {
        product.tags = results.tags;
        this.productService.editProduct(product);
      }
    })
  }

  private stock(product: Product) {
    const propVal = product.stock;
    return (this.editConfig = {
      property: 'stock',
      propType: typeof propVal,
      product,
      formGroup: this.fb.group({
        stock: new FormControl(propVal || ''),
      }),
      controlType: 'number',
      save: (results: any) => {
        product.stock = JSON.parse(results.stock);
        this.productService.editProduct(product)
      }
    });
  }

  private discount(product: Product) {
    const propVal = product.discount || 0;
    return (this.editConfig = {
      property: 'discount',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        discount: new FormControl(propVal),
      }),
      controlType: 'number',
      save: (results: any) => {
        product.discount = JSON.parse(results.discount);
        this.productService.editProduct(product)

      }
    });
  }

  private description(product: Product) {
    const propVal = product.description;
    return (this.editConfig = {
      property: 'description',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        description: new FormControl(propVal || ''),
      }),
      controlType: 'textarea',
      save: (results: any) => {
        product.description = results.description;
        this.productService.editProduct(product)
      }
    });
  }

  private title(product: Product) {
    const propVal = product.title;
    return (this.editConfig = {
      property: 'title',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        title: new FormControl(propVal || ''),
      }),
      controlType: 'text',
      save: (results: any) => {
        product.title = results.title;
        this.productService.editProduct(product)
      }
    });
  }

  private id(product: Product) {
    const propVal = product.id;
    return (this.editConfig = {
      property: 'id',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        id: new FormControl(propVal || 0),
      }),
      controlType: 'number',
      save: (results: any) => {
        product.id = JSON.parse(results.id);
        this.productService.editProduct(product)
      }
    });
  }

  private type(product: Product) {
    const propVal = product.type;
    return (this.editConfig = {
      property: 'type',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        type: new FormControl(propVal || ''),
      }),
      controlType: 'text',
      save: (results: any) => {
        product.type = results.type;
        this.productService.editProduct(product)
      }
    });
  }

  private images(product: Product) {
    const propVal: any = [...product.images];
    return this.editConfig = {
      property: 'images',
      propType: typeof propVal,
      propVal,
      product,
      controlType: 'file',
      formGroup: this.fb.group({
        images: new FormControl(propVal || ''),
      }),
      save: (results: any) => {
        this.photos = [];
        product = this.formatImages(results.images, product)
        console.log('saving images', results, product.images)
        this.productService.editProduct(product)
      }
    };
  }
  private formatImages(list: any[], product: Product) {
    const id = product.id;
    product.images = list.map((img, idx) => {
      return {
        src: img.url,
        id,
        alt: img.alt,
        image_id: +Number(`${id}${idx}`),
        variant_id: [+Number(`${id}0${idx}`)]
      }
    })
    this.photos = list;
    return product;
  }

  // Variant Property Edit Methods [color, price, sku]
  private color(product: Product, variantIdx) {
    const variant = product.variants[variantIdx];
    const propVal = variant.color;
    return (this.editConfig = {
      property: 'color',
      propType: typeof propVal,
      propVal,
      product,
      formGroup: this.fb.group({
        color: [propVal || ''],
      }),
      controlType: 'text',
      variant,
      save: (results: any) => {
        product.variants.forEach((v) => (v.color = results.color))
        this.productService.editProduct(product)
      }
    });
  }

  private price(product: Product, variantIdx) {
    const variant = product.variants[variantIdx];
    const propVal = variant.price;
    return (this.editConfig = {
      property: 'price',
      propType: typeof variant.price || 0,
      propVal,
      product,
      formGroup: this.fb.group({
        price: new FormControl(propVal),
      }),
      controlType: 'number',
      variant,
      save: (results: any) => {
        product.variants[variantIdx].price = JSON.parse(results.price);
        this.productService.editProduct(product)
      }
    });
  }

  private sku(product: Product, variantIdx) {
    const variant = product.variants[variantIdx];
    const propVal = variant.sku;
    return (this.editConfig = {
      property: 'sku',
      propType: typeof variant.sku,
      propVal,
      product,
      formGroup: this.fb.group({
        sku: new FormControl(propVal || ''),
      }),
      controlType: 'text',
      variant,
      save: (results: any) => {
        product.variants[variantIdx].sku = results.price;
        this.productService.editProduct(product)
      }
    });
  }

  public displayTags(e, product, property) {
    product[property] = e;
    this.productService.editProduct(product);
    // console.log('Tags', e)
  }

  public addVariant(product, content) {
    this.modalService.open(content, { size: 'md' })
      .result.
      then(results => {
        const idx = product.variants.length;
        const variant = this.buildVariant(product, results, idx)
        product.variants.push(variant);
        this.productService.editProduct(product);
      }, dismissed => console.log(dismissed))
  }

  private buildVariant(product: Product, config: { color: string, size: string, price: number }, idx: number) {
    const { id } = product;
    const title = product.type.substring(0, 1).toUpperCase();
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

  deleteVariant(prop: string, product: Product, variantIdx: number) {
    const variant: Variant[] = product.variants.splice(variantIdx, 1);
    this.productService.editProduct(product);
    this.toast.show(this.DangerToast, {
      classname: 'bg-danger text-light',
      delay: 10000,
    });
  }

  ngOnInit() {
    this.product.subscribe((product) => {
      this.selectedVariant = this.selectVariantBySize(
        product.size,
        product.variants
      );
      this.photos = product.images;
    });
  }
}

/* TODO: Method to change images */
