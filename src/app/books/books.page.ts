import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BooksService } from '../api/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss']
})
export class BooksPage implements OnInit {

  results: Observable<any>;
  searchTerm: string = '';

  constructor(private booksService: BooksService) { }

  ngOnInit() {
  }

  searchChanged() {
    
    // Call our service function which returns an Observable
    this.results = this.booksService.searchData(this.searchTerm);
  }

}
