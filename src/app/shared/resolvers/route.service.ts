import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { map, take } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class RouteResolverService {
  constructor(private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log('product id', route.params.id)

    const url = state.url;
    const {firstname} = JSON.parse(localStorage.getItem('admin_profile'))
    console.log('route', route, state.url.replace(':user', firstname))

    this.router.navigate(['v1', firstname, 'dashboard/default']);
    return true;
  }
}
