import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'books',
        children: [
          {
            path: '',
            loadChildren: '../books/books.module#BooksPageModule'
          }
        ]
      },
      {
        path: 'books-favorite',
        children: [
          {
            path: '',
            loadChildren: '../books-favorite/books-favorite.module#BooksFavoritePageModule'
          }
        ]
      },
      {
        path: 'books-scan',
        children: [
          {
            path: '',
            loadChildren: '../books-scan/books-scan.module#BooksScanPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/books',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/books',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
