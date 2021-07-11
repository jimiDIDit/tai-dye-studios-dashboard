import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NavService } from '../../service/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() admin: any;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  @Input() notifications: any[];
  public logoUrl = 'assets/images/dashboard/logo.png';
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  /* TODO: Add push notifications */
  /* TODO: Add translate service */
  /* TODO: Add Admin list */

  constructor(private router: Router, public navServices: NavService, private authService: AuthService) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  public async logout() {
    await this.authService.logout();
    await this.router.navigate(['auth', 'login']);
  }


  ngOnInit() {
  }

}
