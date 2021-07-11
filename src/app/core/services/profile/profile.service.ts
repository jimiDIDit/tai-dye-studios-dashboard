import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { catchError } from 'rxjs/operators';

export interface AdminPermissions {
  [key: string]: any;
  messages?: boolean;
  pushNotifications?: boolean;
}
export interface AdminProfile {
  [key: string]: any;
  id?: string;
  firstname?: string;
  displayName?: string;
  lastname?: string;
  email?: string;
  photoUrl?: string;
  gender?: 'male' | 'female' | 'other'| 'private'| string;
  phone?: string;
  location?: any;
  permissions?: AdminPermissions;
  dob?: any;
  socialMedia?: any;
  status?: 'online' | 'offline';
}

const state = {
  id: localStorage.getItem('ADMIN_ID'),
  profile: JSON.parse(localStorage['admin_profile'] || '{}')
}

@Injectable({
  providedIn: 'root'
})


/**Gets basic admin information */
export class ProfileService {
  /**current admins basic profile */
  Profile: AngularFirestoreDocument<AdminProfile>;

  constructor(private afs: AngularFirestore) { }

  /**get current admins profile */
  private get profile() {
    return this.Profile;
  }

  public getProfile() {
    return state.profile;
  }

  /**sets current and retrieves admins profile firestore doc*/
  public getProfileById(id: string): AngularFirestoreDocument<AdminProfile>
  {
    localStorage.setItem('ADMIN_ID', id);
    return this.Profile = this.afs.collection<AdminProfile>('admins').doc(id);
  }

  // public async createProfile(id: string, profileData: AdminProfile | any): Promise<any> {
  //   const profile = await this.getProfileById(id).valueChanges();
  //   profileData.role = 'ADMIN';
  //   return await this.Profile.set({ ...profileData }).then(() => profileData);
  // }

  public updateProfile(profileData: AdminProfile): Promise<void> {
    console.log('updating profile')
    return this.Profile.update({ ...profileData })
      .catch(this.handlePromiseRejects)
  }

  public deleteProfile(): Promise<void> {
    return this.Profile.delete();
  }

  private handlePromiseRejects(error: any): void {
    console.error(error)
  }
}
