import { Component, OnInit } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn} from 'ng-animate';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/core/services/message/message.service';
import { GroupMember, Message, MessageSettings } from 'src/app/core/services/message/message.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('*=>*', useAnimation(fadeIn, {
      delay: '2s',
      // Set the duration to 5seconds and delay to 2 seconds
      params: {
        timimg: 1000,
      }
    }))])
  ]
})
export class ContentLayoutComponent implements OnInit {

  public right_side_bar: boolean;
  public layoutType: string = 'RTL';
  public layoutClass: boolean = false;
  public adminData: any;
  public messagesInstance: {messages: Observable<Message[]>, group: Observable<GroupMember[]>, settings: MessageSettings}
  public settingsOpen: boolean;

  constructor(private route: ActivatedRoute, private messaging: MessageService, public navServices: NavService) { }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event) {
    this.right_side_bar = $event
  }

  public clickRtl(val) {
    if (val === 'RTL') {
      document.body.className = 'rtl';
      this.layoutClass = true;
      this.layoutType = 'LTR';
    } else {
      document.body.className = '';
      this.layoutClass = false;
      this.layoutType = 'RTL';
    }
  }

  public toggleSettings(event?) {
    this.settingsOpen = !this.settingsOpen
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // console.log(data)
      this.adminData = data.data;
    })
    this.messagesInstance = this.messaging.init(this.adminData.id)
   }

}
