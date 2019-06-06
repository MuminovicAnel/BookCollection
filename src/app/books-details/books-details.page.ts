import { BooksService } from './../api/books.service';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Book } from '../model/book.interfaces';


@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.page.html',
  styleUrls: ['./books-details.page.scss'],
})
export class BooksDetailsPage implements OnInit {

  private book: Book[];
  private isFavorite = false;
  private id: string;
  

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private booksService: BooksService) {
    // Get the ID that was passed with the URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.booksService.isFavorite(this.id).then(isFav => {
      this.isFavorite = isFav;
    })
  }

  favoriteBook() {
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.favoriteBook(book).then(() => {
        this.isFavorite = true;
      });
    });
  }

  unFavoriteBook() {
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.unfavoriteBook(book).then(() => {
        this.isFavorite = false;
      });
    });
  }


  ngOnInit() {   
    // Get the information from the API
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.book = book;
    });
  }


  backButton(){
    this.location.back();
  }

  openWebsite(url) {
    window.open(url, '_system');
  }

}
