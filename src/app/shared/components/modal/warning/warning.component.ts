import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  public title = '';
  public body = '';
  constructor() { }

  ngOnInit(): void {
  }

}
