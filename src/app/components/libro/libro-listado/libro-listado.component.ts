import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationService } from 'app/core/services/pagination.service';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'app/components/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-libro-listado',
  templateUrl: './libro-listado.component.html',
  styleUrls: ['./libro-listado.component.scss']
})
export class LibroListadoComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  message: any;
  miproyecto: any;
  misede: any;
  midocumento: any;
  documento: any;

  proyecto: any;
  sede: any;

  elemento: any;
  constructor(
    public page: PaginationService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public auth: AuthService,
    public router: Router,
    public activatedroute: ActivatedRoute
  ) { }

  sub;
  ngOnInit(): void {
    this.elemento = document.getElementById('content');
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.documento = params.get('d');
      this.midocumento = params.get('d');
      this.page.init('Libros', 'numLibro', this.midocumento, { reverse: true, prepend: false });
    });

  }

  ngOnDestroy() {
    this.page.reset();
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more();
    }
  }

  onTop() {
    this.elemento.scrollIntoView = document.documentElement.scrollIntoView({ behavior: 'smooth' });
  }

  onScroll() {
    this.page.more();
  }

  trackByFn(index, item) {
    return item.id;
  }

  goRegistrar(libro) {
    this.router.navigate(['documento', this.documento, 'libros', libro.numLibro, 'registrar']);
  }

  goDocumentos() {
    this.router.navigate(['documento']);
  }

  goSede() {
    this.router.navigate(['Home']);
  }

  goListado(libro) {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede',
      this.misede, 'documentos', this.documento, 'libros', libro.numLibro]);
  }

}
