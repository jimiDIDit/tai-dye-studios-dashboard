import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastsService } from '../../service/toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit {

  constructor(public toastService: ToastsService) { }

  ngOnInit(): void {
  }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
