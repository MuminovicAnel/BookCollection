import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BooksKeywordsPage } from './books-keywords.page';

import { LongPressModule } from 'ionic-long-press';

const routes: Routes = [
  {
    path: '',
    component: BooksKeywordsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LongPressModule
  ],
  declarations: [BooksKeywordsPage]
})
export class BooksKeywordsPageModule {}
