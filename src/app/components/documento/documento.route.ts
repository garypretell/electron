import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoComponent } from './documento.component';
import { LibroComponent } from '../libro/libro.component';
import { PlantillaComponent } from '../plantilla/plantilla.component';
import { AdminGuard } from '../auth/guards';
import { LibroListadoComponent } from '../libro/libro-listado/libro-listado.component';
import { LibroDetailComponent } from '../libro/libro-detail/libro-detail.component';
import { LibroRegistrarComponent } from '../libro/libro-registrar/libro-registrar.component';
import { UploadImagenComponent } from '../libro/upload-imagen/upload-imagen.component';
import { BuscarRegistroComponent } from './buscar-registro/buscar-registro.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DocumentoComponent, pathMatch: 'full' },
      {
        path: ':d',
        children: [
          { path: '', redirectTo: 'libros', pathMatch: 'full' },
          { path: 'listado', component: LibroListadoComponent },
          { path: 'busqueda', component: BuscarRegistroComponent },
          { path: 'plantilla', component: PlantillaComponent, canActivate: [AdminGuard] },
          {
            path: 'libros',
            children: [
              { path: '', component: LibroComponent, pathMatch: 'full' },
              {
                path: ':l',
                children: [
                  { path: '', component: LibroDetailComponent, pathMatch: 'full' },
                  { path: 'registrar', component: LibroRegistrarComponent },
                  { path: 'upload', component: UploadImagenComponent }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentoRoutingModule { }

