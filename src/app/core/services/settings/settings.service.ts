import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase';

const DEFAULT_SETTINGS = {
  /**Settings associated with layout */
  layout: {
    /** direction */
    rtl: false,
    fontSize: '1em',
    fontFamily: ['work-Sans, sans-serif', 'Nunito'],
    /**pages settings options */
  },
  /**background and font colors */
  theme: {
    /* primary and secondary theme colors */
    colors: ['#3DC8B7', '#A5A5A5'],
    dark: false,
  }
}

export interface DashboardSettings {
  [key: string]: any;
  layout?: any;
  theme?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  Settings: AngularFirestoreDocument<DashboardSettings>;
  constructor(private afs: AngularFirestore) { }

  public get settings() {
    return this.Settings;
  }

  public init(profileId: string): AngularFirestoreDocument<unknown> {
    return this.Settings = this.afs.collection('admins').doc(profileId)
  }

  public update(settings: DashboardSettings) {
    return this.Settings.update(settings);
  }

  public resetToDefault() {
    return this.Settings.set({ ...DEFAULT_SETTINGS });
  }
}
