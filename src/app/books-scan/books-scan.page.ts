import { Component, OnInit } from '@angular/core';
import { BooksService } from '../api/books.service';
import { Book } from '../model/book.interfaces';

const STORAGE_KEY = 'wishListBooks';

@Component({
  selector: 'app-books-scan',
  templateUrl: 'books-scan.page.html',
  styleUrls: ['books-scan.page.scss']
})
export class BooksScanPage implements OnInit {

  private results: Book[];

  constructor(private booksService: BooksService) {
    
  }

  ngOnInit() {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      value.forEach(result => {
        this.results = result.items;
      })      
    });
  }

  // Refresh the list if no value loaded
  doRefresh(refresher?) {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      this.results = value;  
      if (refresher) {
          refresher.target.complete();
      }
    });
  }

}
