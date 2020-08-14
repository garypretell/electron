import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'app/components/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ImprimirRegistroComponent } from '../imprimir-registro/imprimir-registro.component';
declare const jQuery: any;
declare const $;
@Component({
  selector: 'app-libro-detail',
  templateUrl: './libro-detail.component.html',
  styleUrls: ['./libro-detail.component.scss']
})
export class LibroDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ImprimirRegistroComponent) childImprimir: ImprimirRegistroComponent;
  @ViewChild('myModalEditS') myModalEditS: ElementRef;
  private unsubscribe$ = new Subject();
  searchObject: any = {};
  userFilterF: any = { estado: 'true' };
  newObject: any = {};
  editObject: any = {};
  miproyecto: any;
  proyecto: any;
  misede: any;
  sede: any;
  documento: any;
  midocumento: any;
  milibro: any;
  miruta: any;
  p = 1;
  campos$: Observable<any>;
  registros$: Observable<any>;
  micodigo: any;
  constructor(
    public auth: AuthService,
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
  ) { }

  sub;
  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.documento = params.get('d');
      this.midocumento = this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.verifyData(this.miruta);
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
      this.registros$ = this.afs.collection(`Registros`, ref => ref
        .where('documento', '==', this.documento).where('libro', '==', parseFloat(this.milibro)).orderBy('mifecha', 'desc'))
        .valueChanges({ idField: 'id' });
    })).subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  verifyData(libro) {
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
      });
  }

  goSede() {
    this.router.navigate(['Home']);
  }

  goDocumento() {
    this.router.navigate(['documento']);
  }

  goLibro() {
    this.router.navigate(['documento', this.documento, 'libros']);
  }

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

  enableEditing($event, item) {
    this.afs.doc(`Registros/${item.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.editObject = data;
    });
    this.micodigo = item.id;
    jQuery(this.myModalEditS.nativeElement).modal('show');
  }

  updateRegistroS() {
    this.afs.doc(`Registros/${this.micodigo}`).set(this.editObject, { merge: true });
    jQuery(this.myModalEditS.nativeElement).modal('hide');
  }

  printRegistro(data) {
    this.childImprimir.print();
  }

  seleccionar(data) {
    try {
      this.childImprimir.imprimirReg(data, this.documento);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No existen un modelo de plantilla en el sistema, agregue uno!'
      });
    }
  }

  deleteRegistro(registro) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Registro?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Registros/${registro.id}`).delete();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  }

  printLibro() {}

}
