import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('editModal') editModal: ElementRef;
  usuariotoEdit: any = {};

  subscriber: any;
  editor: any;
  admin: any;
  super: any;
  displayName: any;

  miproyecto: any;
  misede: any;

  arrayTemp: any;
  idx: any;
  campotoEditS: any = {};

  usuarios$: Observable<any>;
  searchObject: any = {};
  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public auth: AuthService,
  ) { }


  // sub;
  ngOnInit() {
    // this.sub = this.activatedroute.data.subscribe((data: { usuarios: Observable<any[]> }) => {
    //   this.usuarios$ = data.usuarios;
    // });
    this.usuarios$ = this.afs.collection('usuarios').valueChanges();

  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  deleteUsusario(usuario) {
    Swal.fire({
      title: 'Esta seguro de eliminar este usuario?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`usuarios/${usuario.uid}`).delete();
        Swal.fire(
          'Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
      }
    });
  }

  editUsuario(usuario) {
    this.afs.doc(`usuarios/${usuario.uid}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.usuariotoEdit = usuario.uid;
      this.subscriber = data.roles.subscriber;
      this.editor = data.roles.editor;
      this.admin = data.roles.admin;
      this.displayName = usuario.displayName;
    });
    jQuery(this.editModal.nativeElement).modal('show');
  }

  async updateUsuario() {
    const roles: any = {
      displayName: this.displayName,
      roles: {
        admin: this.admin,
        editor: this.editor,
        subscriber: this.subscriber,
      }
    };
    await this.afs.doc(`usuarios/${this.usuariotoEdit}`).set(roles, { merge: true });
    jQuery(this.editModal.nativeElement).modal('hide');
  }

  goReporte(usuario) {
    this.router.navigate(['usuario', usuario.uid]);
  }
}
