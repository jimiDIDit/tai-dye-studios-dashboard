import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs;
  public title: string;
  public user;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) {
    activatedRoute.queryParams.subscribe(params => this.user = params.id)

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
          this.user = route.snapshot.queryParams.user;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        let snapshot = this.router.routerState.snapshot;
        let title = route.snapshot.data['title'];
        let parent = route.parent.snapshot.data['breadcrumb'];
        let child = route.snapshot.data['breadcrumb'];
        this.breadcrumbs = {};
        this.title = title;
        this.breadcrumbs = {
          "parentBreadcrumb": parent,
          "childBreadcrumb": child
        }
      });
  }

  ngOnInit() { }

  ngOnDestroy() { }

}
