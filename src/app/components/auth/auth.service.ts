import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated$: Observable<boolean>;
  user$: Observable<any>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.authenticated$ = afAuth.authState.pipe(map(user => !!user));
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`usuarios/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async register(email: string, password: string, displayName: string): Promise<any> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.createUserData(user, displayName)
      await this.sendVerifcationEmail();
      return user;
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async sendVerifcationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error->', error);
    }
  }

  isEmailVerified(user: any): boolean {
    return user.emailVerified === true ? true : false;
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);
    const data: any = {
      lastSesion: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      estado: true,
      roles: {
        subscriber: true
      }
    };
    return userRef.set(data, { merge: true });
  }

  private async createUserData(user, displayName) {
    const usuarioRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);
    const data: any = {
      lastSesion: Date.now(),
      uid: user.uid,
      displayName: displayName,
      email: user.email,
      estado: true,
      roles: {
        subscriber: true,
        editor: false,
        admin: false,
        super: false
      }
    };
    return usuarioRef.set(data);
  }

  ///// Role-based Authorization /////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canSuper(user: User): boolean {
    const allowed = ['super'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    // tslint:disable-next-line:curly
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }
}


