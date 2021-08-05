import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
export interface StorageRef extends AngularFireStorageReference { };
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  productsRef: AngularFireStorageReference;
  testProductsRef: AngularFireStorageReference;
  teamRef: AngularFireStorageReference;
  constructor(private storage: AngularFireStorage) {
    this.productsRef = storage.ref('products');
    this.testProductsRef = storage.ref('test-products');
    this.teamRef = storage.ref('team');
  }

  public async addProductImage(file: File, folder: string, parentFolder: string) {
    console.log(file, folder, parentFolder)
    const name = file.name;
    const filePath = `${parentFolder}/${folder}/${name}`;
    const fileRef = this.storage.ref(filePath);
    return await this.storage.upload(filePath, file)
      .then(async results => {
        return results.ref.getDownloadURL()
          .then(url => {
          return {fileRef, url}
      }).catch(err => console.log('ERROR! Failed to get download URL', err))
    });
    // return { task, fileRef };
  }

  public deleteProductImage(pathOrRef?: string | AngularFireStorageReference) {
    if (typeof pathOrRef === 'string') {
      return this.storage.ref(pathOrRef).delete();
    }
    if (pathOrRef.hasOwnProperty('delete')) {
      return pathOrRef.delete();
    }
  }

  public sortMedia(arr: any[], sortBy: string = 'id', asc = true) {
    return arr.sort((a: any, b: any) => {
      if (asc) {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy]
      }
    })
  }
}
