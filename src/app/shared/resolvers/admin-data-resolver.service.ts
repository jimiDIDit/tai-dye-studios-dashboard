import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDataResolverService {

  constructor(private router: Router, private authService: AuthService, private profileService: ProfileService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = localStorage.getItem('ADMIN_ID');
    // console.log('id', id)

    return this.profileService.getProfileById(id)
      .valueChanges()
      .pipe(
        take(1),
        mergeMap(profile => {
          if (profile) {
            localStorage.setItem('admin_profile', JSON.stringify(profile))
            // console.log('Profile Resolved')
            return of(profile)
          } else {
            this.router.navigate(['auth', 'login']);
            return EMPTY;
          }
        })
      )

  }
}
