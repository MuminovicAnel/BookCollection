import { BooksService } from './../api/books.service';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.page.html',
  styleUrls: ['./books-details.page.scss'],
})
export class BooksDetailsPage implements OnInit {

  book = null;

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private booksService: BooksService) { }

  ngOnInit() {
    // Get the ID that was passed with the URL
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    // Get the information from the API
    this.booksService.getDetails(id).subscribe(result => {
      this.book = result;
    });
  }

  backButton(){
    this.location.back();
  }

  openWebsite() {
    window.open(this.book['volumeInfo'].previewLink, '_system');
  }

}
