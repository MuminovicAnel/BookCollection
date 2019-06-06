import { BooksService } from './../api/books.service';
import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.interfaces';
import { $ } from 'protractor';

@Component({
  selector: 'app-books-favorite',
  templateUrl: 'books-favorite.page.html',
  styleUrls: ['books-favorite.page.scss']
})
export class BooksFavoritePage implements OnInit {

  private results: Book[];

  constructor(private booksService: BooksService) { }

  ngOnInit() {
    // Return the result to view
    this.booksService.getAllFavoriteBooks().then((value) => {
      this.results = value;  
  });
  }
  // Refresh the list if no value loaded
  doRefresh(refresher?) {
    this.booksService.getAllFavoriteBooks().then((value) => {
      this.results = value;  
      if (refresher) {
          refresher.target.complete();
      }
  });

}
  
}
