import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'app/components/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from "sweetalert2";
declare let jQuery: any;
declare const $;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  checkBoxValue: boolean;
  validarCodigos: boolean;
  proyecto: any;
  proyectoN: any;
  sedeN: any;
  sede: any;
  public accountForm: FormGroup;
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public auth: AuthService,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
  ) {
    this.checkBoxValue = false;
    this.validarCodigos = false;
  }

  ngOnInit() {
    this.accountForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  postSignIn(): void {
    this.router.navigate(['/Home']);
  }

  async onRegister() {
    if (this.accountForm.value.email && this.accountForm.value.password) {
      try {
        const user = await this.auth.register(this.accountForm.value.email, this.accountForm.value.password, this.accountForm.value.displayName);
        if (user) {
          const isVerified = this.auth.isEmailVerified(user);
          this.redirectUser(isVerified);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Todos los campos son requeridos!',
      })
    }


  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['Home']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }

}
