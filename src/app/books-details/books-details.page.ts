import { BooksService } from './../api/books.service';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Book } from '../model/book.interfaces';
import { ToastController } from '@ionic/angular';

const STORAGE_KEY = 'favoriteBooks';

@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.page.html',
  styleUrls: ['./books-details.page.scss'],
})
export class BooksDetailsPage implements OnInit {

  private book: Book[];
  private isFavorite = false;
  private id: string;
  

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private booksService: BooksService, private toastController: ToastController, private router: Router) {
    // Get the ID that was passed with the URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // Check if title exist in storage
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.isFavorite(book['volumeInfo']['title'], STORAGE_KEY).then(isFav => {
        this.isFavorite = isFav;
      });
    });
  }

  // Function that store an item
  async favoriteBook() {
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.favoriteBook(book['volumeInfo'], STORAGE_KEY).then(() => {
        this.isFavorite = true;
      });
    });
    const toast = await this.toastController.create({
      translucent: true,
      duration: 5000,
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Added in your favorites !',
          handler: () => {
            this.router.navigateByUrl('tabs/books-favorite');
          }
        }, {
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  // Function that unset an item from the storage
  async unFavoriteBook() {
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.unfavoriteBook(book['volumeInfo'], STORAGE_KEY).then(() => {
        this.isFavorite = false;
      });
    });
    const toast = await this.toastController.create({
      message: 'Successfully unfavorited',
      duration: 2000
    });
    toast.present();
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
