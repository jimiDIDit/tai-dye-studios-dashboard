import { Component, Input, OnInit, Output, TemplateRef, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Image, CarouselConfig, DotsConfig, PreviewConfig } from '@ks89/angular-modal-gallery';
import { BehaviorSubject, of } from 'rxjs';
import { MediaService } from 'src/app/core/services/media/media.service';
import { environment } from 'src/environments/environment';
import { ModalService } from '../../service/modal.service';

export interface UploadConfig {
  [key: string]: any;
  parentFolder?: string;
  folder?: string;
  path?: string;
  appendUploadToExisting?: boolean;
}

const DEV_UPLOAD_CONFIG_DEFAULTS: UploadConfig = {
  parentFolder: 'test-products',
  folder: 'tshirt',
  path: 'test-products/tshirt/',
  appendUploadToExisting: false,
}

const PROD_UPLOAD_CONFIG_DEFAULTS: UploadConfig = {
  parentFolder: 'products',
  folder: 'tshirt',
  path: 'products/tshirt/',
  appendUploadToExisting: false,
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy{
  @ViewChild('uploadErrorModal', { static: true }) UploadErrorModal: TemplateRef<any>;
  @Output() mediaSaved = new EventEmitter<any>();
  @Input() images: any = [];
  @Input() config: UploadConfig = null;
  @Input() form: FormGroup = null;
  @Input() size = 'lg';
  @Input() mode: 'add'|'edit' = 'add';
  public saved: any[] = [];
  public staged: any[] = [];
  public uploadsSaved = false;
  public uploadErrorMsg = '';
  constructor(private fb: FormBuilder, private modalService: ModalService, private mediaService: MediaService) {
  }

  public setSize(size: string) {
    switch (size) {
      case 'xs':
        return 'w-25'
        break;
      case 'sm':
        return 'w-50'
        break;
      case 'md':
        return 'w-75'
        break;
      case 'lg':
        return 'w-100'
        break;
      default:
        return 'w-100'
        break;
    }
  }

  public read(event: any, config: UploadConfig, input?: NgForm) {
    const files: File[] = event.target.files;
    if (files.length === 0) return;
    files.forEach((file: File, idx: number) => {
      this.checkForErrors(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        setTimeout(() => {
          this.staged.push({ preview: reader.result.toString(), file, config });
        }, 0)
      }
    })
  }

  public async upload(stagedImages: any[]) {
    console.log(stagedImages)
    stagedImages.map((item: any, idx) => {
      const { file, config } = item;
      const { folder, parentFolder } = config;
      setTimeout(() => {
        this.mediaService.addProductImage(file, folder, parentFolder)
          .then(results => {
            this.images.push({ url: results.url, alt: file.name });
            console.log('Media Upload Results', results)
          });
        }, 1250)
      })
    this.uploadsSaved = true;
    // this.staged = [];
  }

  edit(stagedImages: any[]) {
    this.form.reset();
    stagedImages.map((item: any, idx) => {
      const { file, config } = item;
      const { folder, parentFolder } = config;
      setTimeout(() => {
        this.mediaService.addProductImage(file, folder, parentFolder)
          .then(results => {
            this.images.push({ url: results.url, alt: file.name });
            console.log('Media Upload Results', results)
          });
      }, 0)
    })
    this.form.setValue({images: this.images})
    this.uploadsSaved = true;
  }


  public discard(itemsToDiscard: any[]) {
    if (this.uploadsSaved) {
      itemsToDiscard.map(item => {
        if (item.hasOwnProperty('fileRef')) {
          this.mediaService.deleteProductImage(item.fileRef)
        }
        this.mediaService.deleteProductImage(`${item.config.parentFolder}/${item.config.folder}/${item.file.name}`)
      })
    }
    this.staged = [];
  }

  public discardItem(item, idx) {
    this.staged.splice(idx, 1);
  }

  private stageAfterLoading(reader: FileReader, file: File, config: UploadConfig) {
    reader.onload = (_event) => {
      setTimeout(() => {
        this.staged.push({ preview: reader.result.toString(), file, config })
      }, 500)
      }
  }

  private checkForErrors(file) {
    if (file.size > 1000000) {
      const msg = 'Size Exceeded. Image size must be less than 1MB/1,000,000KB.'
      return this.uploadError(file, 0, msg, this.UploadErrorModal);
    }
    //Image upload validation
    var mimeType = file.type;
    console.log('Upload MIME type', mimeType)
    if (mimeType.match(/image\/*/) == null) {
      const msg = `${mimeType} is not an acceptable image MIME type. Must be jpg, jpeg, or png`;
      return this.uploadError(file, 0, msg, this.UploadErrorModal);
    }
  }

  private uploadError(files: FileList, fileIdx: number, msg: string, content: any, options?: any) {
    this.uploadErrorMsg = msg;
    files[fileIdx].slice();
    this.modalService.open(content, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
      ...options
    })
      .result.then(result => {
        console.log('Closed Modal', result)
      }, dismissed => console.log('Dismissed Modal', dismissed))
  }
  ngOnInit(): void {
    if (environment.production) {
      this.config = { ...PROD_UPLOAD_CONFIG_DEFAULTS, ...this.config};
    } else {
      this.config = { ...DEV_UPLOAD_CONFIG_DEFAULTS, ...this.config };
    }
  }

  ngOnDestroy() {
  }

}
