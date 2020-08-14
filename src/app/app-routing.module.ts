import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { RequireUnauthGuard } from './components/auth/guards';


const routes: Routes = [
  {
    path: '',
    loadChildren:  './components/auth/auth.module#AuthModule',
    canActivate: [RequireUnauthGuard]
  },
  {
    path: 'Home',
    loadChildren:  './components/inicio/inicio.module#InicioModule',
  },
  {
    path: 'registrar',
    loadChildren: './components/account/account.module#AccountModule',

  },
  {
    path: 'verify-email',
    loadChildren: './components/verify/verify.module#VerifyModule',
  },
  {
    path: 'documento',
    loadChildren: './components/documento/documento.module#DocumentoModule'
  },
  {
    path: 'Chat',
    loadChildren: './components/chat/chat.module#ChatModule'
  },
  {
    path: 'chats/:id',
    loadChildren:'./components/chat-user/chat-user.module#ChatUserModule'
  },
  {
    path: 'usuario',
    loadChildren: './components/usuario/usuario.module#UsuarioModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
