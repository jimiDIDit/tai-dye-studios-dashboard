import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminProfile } from '../profile/profile.service';
import { DEFAULT_SETTINGS, GroupMember, Message, MessageSettings } from './message.interface';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private Messages: Observable<Message>;
  public Settings: Observable<MessageSettings>;
  public MessagingGroup: Observable<GroupMember[]>;
  constructor(private afs: AngularFirestore) { }

  private get messages(): AngularFirestoreCollection<Message> {
    return this.afs.collection<Message>('messages');
  }

  private getGroup(userId: string) {
    return this.MessagingGroup = this.afs.collection<AdminProfile>('admins')
      .valueChanges()
      .pipe(map(users => {
        return users.filter(user => user.permissions.messages && user.id !== userId).map(user => {
          const { id, displayName, photoUrl, status } = user;
          const participant: GroupMember = {
            id,
            displayName,
            photoUrl,
            status
          }
          return participant;
        })
    }))
  }

  private initSettings(userId: string) {
    return this.Settings = new Observable(observer => {
      observer.next({
        ...DEFAULT_SETTINGS,
        users: this.getGroup(userId),
        userId,
      })
      observer.complete();
    }
    )
  }

  public init(userId: string) {
    return {
      group: this.getGroup(userId),
      messages: this.getMessages(),
      settings: this.initSettings(userId),
    }
  }

  public getMessages() {
    return this.Messages = this.messages.valueChanges()
  }

  public addMessage(message: Message) {
    this.messages.add(message);
  }

  public deleteMessage(message: Message) {
    return this.messages.doc(message.id).delete();
  }

}
