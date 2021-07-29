import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { map } from 'rxjs/operators';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminDataResolverService } from './shared/resolvers/admin-data-resolver.service';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'u/dashboard/default'
  },
  {
    path: 'u',
    component: ContentLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [...content],
    resolve: {
      data: AdminDataResolverService
    }
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'u/dashboard/default'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
