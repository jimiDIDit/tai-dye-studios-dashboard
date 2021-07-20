import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavService } from './service/nav.service';
import { WINDOW_PROVIDERS } from './service/windows.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WarningComponent } from './components/modal/warning/warning.component';
import { ToastsComponent } from './components/toasts/toasts.component';

@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    SafeHtmlPipe,
    ContentLayoutComponent,
    ColorPickerComponent,
    ImageUploadComponent,
    WarningComponent,
    ToastsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [NavService, WINDOW_PROVIDERS],
  exports: [FeatherIconsComponent, ToggleFullscreenDirective, SafeHtmlPipe, ContentLayoutComponent, NgbModule, ColorPickerComponent, ImageUploadComponent, WarningComponent, ToastsComponent]
})
export class SharedModule { }
