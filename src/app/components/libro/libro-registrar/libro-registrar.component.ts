import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { switchMap, map, takeUntil, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { AuthService } from 'app/components/auth/auth.service';
import { ElectronService } from 'app/core/services';
declare const jQuery: any;
declare const $;

@Component({
  selector: 'app-libro-registrar',
  templateUrl: './libro-registrar.component.html',
  styleUrls: ['./libro-registrar.component.scss']
})
export class LibroRegistrarComponent implements OnInit, OnDestroy {
  @ViewChild('myModalEditS') myModalEditS: ElementRef;
  private unsubscribe$ = new Subject();
  checkBoxValue: boolean;
  newObject: any = {};
  editObject: any = {};
  registrotoEdit: any = {};
  userFilterF: any = { estado: 'true' };
  p: any;
  miproyecto: any;
  micodigo: any;
  misede: any;
  midocumento: any;
  documento: any;
  milibro: any;
  miruta: any;
  registros$: Observable<any>;
  campos$: Observable<any>;
  proyecto: any;
  sede: any;
  rutaImg: any;
  objImg: any;
  indx: any;
  midata: any;
  listado: boolean;
  image: any;
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    private electronService: ElectronService,
    private activatedroute: ActivatedRoute
  ) { this.checkBoxValue = true; }

  sub;
  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.documento = params.get('d');
      this.midocumento = this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.rutaImg = params.get('d').replace(/ /g, '') + '_' + this.milibro;
      this.actualizarData(this.miruta);
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
      this.registros$ = this.afs.collection(`Registros`, ref => ref
        .where('documento', '==', this.documento).where('libro', '==', parseFloat(this.milibro)).orderBy('mifecha', 'desc').limit(6))
        .valueChanges({ idField: 'id' });
    });
    $('input:text:visible:first').focus();

    this.cargarImagen();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  actualizarData(libro) {
    this.afs.firestore.doc(`Libros/${libro}`).get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este Libro no ha sido registrado!'
          });
          this.goLibro();
        }
      }
      );
  }
  
  goLibro() {
    this.router.navigate([ 'documento', this.documento, 'libros']);
  }

  deleteRegistro(registro) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Registro?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Libros/${this.rutaImg}`).valueChanges().pipe(take(1)).subscribe((data: any) => {
          if (data) {
            const index = (data.imagenes).findIndex(x => x.path === registro.path);
            const imagen = data.imagenes.filter(f => f.path === registro.path);
            const objeto = imagen[0];
            objeto.estado = false;
            data.imagenes[index] = objeto;
            const array = {
              imagenes: data.imagenes
            };
            this.afs.doc(`Libros/${this.rutaImg}`).set(array, { merge: true });
          }
        });
        this.afs.doc(`Registros/${registro.id}`).delete();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  }

  enableEditing($event, item) {
    this.afs.doc(`Registros/${item.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.registrotoEdit = data;
      this.editObject = data;
    });
    this.micodigo = item.id;
    jQuery(this.myModalEditS.nativeElement).modal('show');
  }

  updateRegistroS(registrotoEdit) {
    this.afs.doc(`Registros/${this.micodigo}`).set(this.editObject, { merge: true });
    jQuery(this.myModalEditS.nativeElement).modal('hide');
  }

  goListado() {
    this.router.navigate(['documento', this.documento, 'libros', this.milibro]);
  }

  add(registro) {
    try {
      if (this.checkBoxValue) {
        registro.path = this.objImg.path;
        this.objImg.estado = true;
        this.midata[this.indx] = this.objImg;
        const imagenes = {
          imagenes: this.midata
        };
        this.afs.doc(`Libros/${this.rutaImg}`).set(imagenes, { merge: true });
      } else {
        registro.path = 'sin imagen';
      }
      registro.libro = parseFloat(this.milibro);
      registro.createdAt = (new Date().toISOString().substring(0, 10));
      registro.mifecha = Date.parse(new Date().toISOString().substring(0, 10));
      registro.usuarioid = firebase.auth().currentUser.uid;
      registro.documento = this.documento;

      this.afs.collection(`Registros`).add(registro);
      const datos = { contador: firebase.firestore.FieldValue.increment(1) };
      const rutaDoc = this.documento;
      const value = { value: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Documentos/${rutaDoc}`).set(value, { merge: true });
      this.afs.doc(`Libros/${this.miruta}`).set(datos, { merge: true });
      this.newObject = {};
      registro = null;
      // $('input:text:visible:first').focus();
      $('input:enabled:visible:first').focus();
      if (this.checkBoxValue) {
        this.cargarImagen();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No existen imágenes para indexar!'
      });
    }
  }

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

  goSede() {
    this.router.navigate(['Home']);
  }

  goDocumento() {
    this.router.navigate(['documento']);
  }

  cargarImagen() {
    this.afs.doc(`Libros/${this.rutaImg}`).valueChanges().pipe(take(1)).subscribe((data: any) => {
      if (data) {
        this.midata = data.imagenes;
        this.indx = (data.imagenes).findIndex(x => x.estado === false);
        const imagen = data.imagenes.filter(f => f.estado === false);
        if (imagen.length > 0) {
          this.objImg = imagen[0];
          this.image = this.electronService.fs.readFileSync(this.objImg.path).toString('base64');
        }
      } else { return of(null); }
    });
  }

  verListado() {
    this.listado = true;
  }

  verImagen() {
    this.listado = false;
  }

}
