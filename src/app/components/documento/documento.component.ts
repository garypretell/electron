import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import Swal from 'sweetalert2';
declare const jQuery: any;
declare const $;

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;
  documentos$: Observable<any>;
  public addDocumentoForm: FormGroup;
  searchDoc: any = {};
  view: any[];

  // options
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DOCUMENTO';
  showYAxisLabel = true;
  yAxisLabel = 'REGISTROS';
  nombreGrafica: any;
  constructor(
    public formBuilder: FormBuilder,
    public auth: AuthService,
    public router: Router,
    private afs: AngularFirestore,
  ) { 
    this.view = [innerWidth / 2.0, 300];
  }

  ngOnInit(): void {
    this.documentos$ = this.afs.collection('Documentos').valueChanges({ idField: 'ids' });
    this.addDocumentoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }


  getColor(estado) {
    switch (estado) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  showModal() {
    jQuery(this.myModal.nativeElement).modal('show');
  }

  addDocumento() {
    const documento: any = {
      id: (this.addDocumentoForm.value.nombre).replace(/ /g, ''),
      nombre: this.addDocumentoForm.value.nombre,
      name: this.addDocumentoForm.value.nombre,
      Libros: 0,
      principal: false,
      plantilla: false,
      value: 0,
      createdAt: Date.now()
    };
    const ruta = documento.id;
    this.afs.firestore.doc(`Documentos/${ruta}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este documento ya existe!',
          });
          this.addDocumentoForm.reset();
        } else {
          this.afs.doc(`Documentos/${ruta}`).set(documento);
          this.addDocumentoForm.reset();
          jQuery(this.myModal.nativeElement).modal('hide');
        }
      });
  }

  deleteDocumento(documento) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Documento?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Documentos/${documento.ids}`).delete();
        Swal.fire(
          'Eliminado!',
          'El documento ha sido eliminado.',
          'success'
        );
      }
    });
  }

  onResize(event) {
    this.view = [innerWidth / 2.0, 300];
    // this.view = [event.target.innerWidth / 1.35, 400];
  }

  goPlantilla(documento) {
    this.router.navigate(['documento', documento.id,'plantilla']);
  }

  async goReporte() {
    const { uid } = await this.auth.getUser();
    this.router.navigate(['usuario', uid]);
  }

  backClicked() {
    this.router.navigate(["/Home"]);
  }

  goLibro(documento) {
    this.router.navigate(['documento', documento.id, 'libros']);
  }

  buscarDocumentos(documento) {
    this.router.navigate(['documento', documento.id, 'busqueda']);
  }

}
