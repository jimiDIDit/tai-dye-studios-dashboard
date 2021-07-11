import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { map } from 'rxjs/operators';
import { AdminDataResolverService } from './shared/resolvers/admin-data-resolver.service';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/default',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    resolve: {
      data: AdminDataResolverService
    },
    canActivateChild: [AuthGuard],
    children: content
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard/default',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
