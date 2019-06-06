import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BooksService, SearchType } from '../api/books.service';
import { LoadingController, IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Book } from '../model/book.interfaces';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss']
})
export class BooksPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;
  
  public myData = new BehaviorSubject([]);
  private results$: Observable<Book[]>;
  private searchTerm: string = '';
  private type: SearchType = SearchType.all;

  constructor(private booksService: BooksService, private loadingController: LoadingController, private storage: Storage) { }

  ngOnInit() {

  }


  searchChanged() {
    // Call our service function which returns an Observable
    this.results$ = this.booksService.searchData(this.searchTerm, this.type);
  }

  // Loading component
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 100,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });

    loading.onDidDismiss().then(() => {
      this.searchBar.setFocus();
    });

    return await loading.present();

  }

}
