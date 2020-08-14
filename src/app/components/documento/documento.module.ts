
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxKjuaModule } from 'ngx-kjua';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';
import { ImageViewerModule } from 'ng2-image-viewer';
import { DocumentoComponent } from 'app/components/documento/documento.component';
import { DocumentoRoutingModule } from 'app/components/documento/documento.route';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LibroComponent } from '../libro/libro.component';
import { PlantillaComponent } from '../plantilla/plantilla.component';
import { LibroListadoComponent } from '../libro/libro-listado/libro-listado.component';
import { LibroDetailComponent } from '../libro/libro-detail/libro-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImprimirRegistroComponent } from '../libro/imprimir-registro/imprimir-registro.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { LibroRegistrarComponent } from '../libro/libro-registrar/libro-registrar.component';
import { UploadImagenComponent } from '../libro/upload-imagen/upload-imagen.component';
import { SafePipe } from 'app/shared/pipe/Safe.pipe';
import { BuscarRegistroComponent } from './buscar-registro/buscar-registro.component';


@NgModule({
  declarations: [
    DocumentoComponent,
    LibroComponent,
    PlantillaComponent,
    LibroListadoComponent,
    LibroDetailComponent,
    ImprimirRegistroComponent,
    LibroRegistrarComponent,
    UploadImagenComponent,
    SafePipe,
    BuscarRegistroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentoRoutingModule,
    FilterPipeModule,
    InfiniteScrollModule,
    AngularSplitModule,
    NgxPaginationModule,
    DragulaModule,
    NgxKjuaModule,
    ImageViewerModule,
    NgxChartsModule,
    NgxSpinnerModule
  ]
})
export class DocumentoModule { }
