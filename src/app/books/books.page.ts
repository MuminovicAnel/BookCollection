import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BooksService, SearchType } from '../api/books.service';
import { LoadingController, IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Book } from '../model/book.interfaces';


@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss']
})
export class BooksPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;

  private results: Observable<Book>;
  private searchTerm: string = '';
  private type: SearchType = SearchType.all;

  constructor(private booksService: BooksService, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  searchChanged() {    
    // Call our service function which returns an Observable
    this.results = this.booksService.searchData(this.searchTerm, this.type);
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 400,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  setFocus(){
    this.searchBar.setFocus();
  }

}
