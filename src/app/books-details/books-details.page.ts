import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.page.html',
  styleUrls: ['./books-details.page.scss'],
})
export class BooksDetailsPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backButton(){
    this.location.back();
  }

}
