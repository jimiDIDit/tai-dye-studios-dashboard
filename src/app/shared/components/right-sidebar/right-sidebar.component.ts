import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupMember } from 'src/app/core/services/message/message.interface';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  @Input() admin: any;
  @Input() groupMembers: GroupMember[] = [];
  @Output() settingsToggleEvent = new EventEmitter<boolean>();
  public settingsOpen = false;
  constructor() { }
  public toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
    this.settingsToggleEvent.emit(this.settingsOpen);
}
  ngOnInit() { }

}
