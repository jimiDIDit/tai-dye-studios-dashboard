import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private afAuth: AngularFireAuth, private profileService: ProfileService) { }

  public get currentUser(): Promise<firebase.User> {
    return this.afAuth.currentUser;
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(loggedIn => !!loggedIn));
  }

  public async login(email: string, password: string) {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password)
      this.profileService.getProfileById(user.uid).valueChanges()
        .subscribe(profile => {
          this.router.navigate([profile.firstname, 'dashboard', 'default']);
          this.profileService.updateProfile({ status: 'online' })
      })
    } catch (error) {
      const reason = { code: `${error.code}`, msg: `${error.msg}`, log: error };
      return reason;
    }
  }

  public async delete() {
    const user = await this.currentUser;
    return await user.delete();
  }

  public async logout(): Promise<void> {
    console.log('logging out')
    await this.profileService.updateProfile({ status: 'offline' }).then(() => {
      this.afAuth.signOut().then(() => {
        localStorage.removeItem('ADMIN_ID')
        console.log('logged out')
        this.router.navigate(['auth', 'login'])
      });
    })
  }

  private handlError(reason?: any) {

  }
}
