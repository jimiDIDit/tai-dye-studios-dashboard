import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { ProfileService } from '../services/profile/profile.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    return this.checkAuth(url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    return this.checkAuth(url);
  }

  checkAuth(url: string) {
    return this.authService.isLoggedIn
      .pipe(
        take(1),
        map(loggedIn => {
          if (!loggedIn) {
            console.log(`ACCESS DENIED! Login to access ${url}`)
            this.router.navigate(['auth/login']);
            return false;
          } else if (loggedIn) {
            return true;
          } else {
            return true;
          }
        }))
  }

}
