import { Component, ComponentRef, Injectable, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  defaultOptions = {
    size: 'sm',
    centered: true,
  }

  constructor(private modal: NgbModal) { }

  open(content, options: NgbModalOptions = this.defaultOptions): NgbModalRef {
    return this.modal.open(content, options);
  }

  openForDeactivate(content, options: NgbModalOptions = this.defaultOptions): Promise<any> {
    return this.modal.open(content, options)
      .result;
  }
}
