import { BooksService } from './../api/books.service';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Book } from '../model/book.interfaces';
import { ToastController } from '@ionic/angular';


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

    // Check if id exist in storage
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.isFavorite(book['id']).then(isFav => {
        this.isFavorite = isFav;
      });
    });
  }

  async toastFavorite() {
    const toast = await this.toastController.create({
      translucent: true,
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Go to your favorites',
          handler: () => {
            console.log('Favorite clicked');
            this.router.navigateByUrl('tabs/books-favorite');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async toastUnfavorite() {
    const toast = await this.toastController.create({
      message: 'Successfully unfavorited',
      duration: 2000
    });
    toast.present();
  }

  // Function that store an item
  favoriteBook() {
    this.booksService.getDetails(this.id).subscribe((book: Book[])=> {
      this.booksService.favoriteBook(book).then(() => {
        this.isFavorite = true;
      });
    });
  }

  // Function that unset an item from the storage
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
