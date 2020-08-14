import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
declare const jQuery: any;
declare const $;

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss']
})
export class LibroComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('addMLibro') addMLibro: ElementRef;
  documento: any;
  topList$: Observable<any>;
  addLibroForm: FormGroup;
  numLibro: any;
  tipoBusqueda: boolean;
  miusuario: any;
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
  ) {
    
  }

  sub;
  ngOnInit() {
    this.tipoBusqueda = true;
    this.sub = this.activatedroute.paramMap.pipe(map(async params => {
      const { uid } = await this.auth.getUser();
      this.documento = params.get('d');
      this.topList$ = this.afs.collection(`Libros`, ref => ref.where('nomdoc', '==', this.documento).where('uid', '==', uid)
      .orderBy('createdAt', 'desc').limit(6)).valueChanges();
    })).subscribe();

    this.addLibroForm = this.formBuilder.group({
      numLibro: ['', [Validators.required]]
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async addLibro() {
    const { uid } = await this.auth.getUser();
    const libro: any = {
      contador: 0,
      documento: this.documento,
      nomdoc: this.documento,
      numLibro: this.addLibroForm.value.numLibro,
      createdAt: Date.now(),
      imagenes: [],
      plantilla: false,
      plantillaLibro: false,
      plantillaImagen: false,
      uid: uid
    };

    const id = this.documento + '_' + this.addLibroForm.value.numLibro;
    this.afs.firestore.doc(`Libros/${id}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este libro ya existe!',
          });
          this.addLibroForm.reset();
        } else {
          const ruta = this.documento;
          const datos = { Libros: firebase.firestore.FieldValue.increment(1) };
          this.afs.doc(`Documentos/${ruta}`).set(datos, { merge: true });
          this.afs.doc(`Libros/${id}`).set(libro);
          this.addLibroForm.reset();
        }
      });
  }

  goLibro() {
    if (this.numLibro) {
      if (this.tipoBusqueda) {
        this.router.navigate(['documento', this.documento, 'libros', this.numLibro, 'registrar']);
      } else {
        this.router.navigate(['documento', this.documento, 'libros', this.numLibro]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese número de libro a buscar!',
      });

    }
  }

  mostrarTodo() {
    this.router.navigate(['documento', this.documento, 'listado']);
  }

  goListado(libro) {
    this.router.navigate(['documento', this.documento, 'libros', libro.numLibro]);
  }

  goRegistrar(libro) {
    this.router.navigate(['documento', this.documento, 'libros', libro.numLibro, 'registrar']);
  }

  goUpload(libro) {
    this.router.navigate(['documento', this.documento, 'libros', libro.numLibro, 'upload']);
  }

  showModal() {
    jQuery(this.addMLibro.nativeElement).modal('show');
  }

  goDocumentos() {
    this.router.navigate(['documento']);
  }

  goSede() {
    this.router.navigate(['/Home']);
  }

}
