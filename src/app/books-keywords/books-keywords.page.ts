import { Component, OnInit } from '@angular/core';
import { BooksService, SearchType } from '../api/books.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Book } from '../model/book.interfaces';

const STORAGE_KEY = "keywords_category"
@Component({
  selector: 'app-books-keywords',
  templateUrl: './books-keywords.page.html',
  styleUrls: ['./books-keywords.page.scss'],
})
export class BooksKeywordsPage implements OnInit {

  private results: [];
  private keyword: string;
  private type: SearchType = SearchType.subject;
  private listBooksKeywords: string;
  private listBooksResults$: Book[];

  constructor(private booksService: BooksService, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      if(value) {
        this.results = value;   
      }  
    });
  }

  async addKeyword() {
    let item = [];
    item.push({
      text: this.keyword, value: this.keyword
    })
    await this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      if(value){
        value.forEach(element => {
        if(element['text'] === this.keyword) {
          this.inputValidation();
          return null;
        } else {
          value.push({
            text: this.keyword, value: this.keyword
          })
          this.storage.set(STORAGE_KEY, value);
          this.inputAdd();
        }
        });        
      } else {
        this.storage.set(STORAGE_KEY, item);
      }
    })
    
  }

  listBooks(listBooksKeywords) {
    this.booksService.getCategory(listBooksKeywords, this.type).subscribe((book: Book[]) => {
      if(book['totalItems'] === 0) {
        this.noCategory();
      } else {
        this.listBooksResults$ = book;
      }
    })
  }

  async inputValidation() {
    const toast = await this.toastController.create({
      message: 'This value already exist, please choose another.',
      duration: 3000
    });
    toast.present();
   }

   async inputAdd() {
    const toast = await this.toastController.create({
      message: 'Category added !',
      duration: 3000
    });
    toast.present();
   }

   async noCategory() {
    const toast = await this.toastController.create({
      message: 'Sorry. No books for this category !',
      duration: 3000
    });
    toast.present();
   }

}
