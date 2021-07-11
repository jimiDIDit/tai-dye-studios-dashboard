import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference,  } from '@angular/fire/storage';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  public media = []

  public settings = {

    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      file_name: {
        title: 'File Name'
      },
      url: {
        title: 'Url',
      },
    },
  };
  constructor(private storage: AngularFireStorage) {
    // this.media = mediaDB.data;
  }
  // uploadFileToStorage(files: any) {
  //   let downloads: string[] = [];
  //   const file = files[0];
  //   const filePath = 'images/' + file.name;
  //   const ref = this.storage.ref(filePath);
  //   const task = ref.put(file);
  //   task.then(results => {
  //     ref.getDownloadURL().subscribe(url => {
  //       downloads.push(url)
  //       console.log('file upload complete..', { task, results, url, file, filePath });
  //     });
  //   })

  // }



  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    // accept: (file: any, done: Function) => {
    //   console.log(file);
    //   this.uploadFileToStorage(file)
    // },
    url: environment.firebase_config.storageBucket
  };

  ngOnInit() {
  }

}
