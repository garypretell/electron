import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './usuario.component';
import { UsuarioReporteComponent } from './usuario-reporte/usuario-reporte.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: UsuarioComponent, pathMatch: 'full' },
      {
        path: ':u',
        children: [
          { path: '', redirectTo: 'reportes', pathMatch: 'full' },
          { path: 'reportes', component: UsuarioReporteComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
