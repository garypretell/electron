import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioRoutingModule } from './usuario.route';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { UsuarioComponent } from './usuario.component';
import { UsuarioReporteComponent } from './usuario-reporte/usuario-reporte.component';



@NgModule({
  declarations: [UsuarioComponent, UsuarioReporteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule
  ]
})
export class UsuarioModule { }
