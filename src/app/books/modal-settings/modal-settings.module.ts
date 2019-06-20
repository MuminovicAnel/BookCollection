import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalSettingsPage } from './modal-settings.page';
import { IonicAngularThemeSwitchSelectModule } from 'ionic-angular-theme-switch';

const routes: Routes = [
  {
    path: '',
    component: ModalSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicAngularThemeSwitchSelectModule
  ],
  declarations: [ModalSettingsPage]
})
export class ModalSettingsPageModule {}
