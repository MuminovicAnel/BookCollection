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
  private disabledTrash = true;
  private disabledCreate = true;
  private deleteValue: string;
  private editValue: string;

  constructor(private booksService: BooksService, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      if(value) {
        this.results = value;   
      }  
    });
  }

  showDelete(listBooksKeywords) {
    this.disabledTrash = false;
    this.disabledCreate = false;
    this.deleteValue = listBooksKeywords;
    this.editValue = listBooksKeywords;
  }

  deleteKeyword() {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then(result => {
      if (result) {
        var index = result.indexOf(this.deleteValue);
        result.splice(index, 1);
        this.delete();
        return this.storage.set(STORAGE_KEY, result);
      }
    });
  }

  editKeyword() {
    let item = [];
    item.push({
      text: this.editValue, value: this.editValue
    })
    console.log(item)
    //this.booksService.storeUpdate(item, STORAGE_KEY);
  }

  // Refresh the list if no value loaded
  doRefresh(refresher?) {
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then((value) => {
      if(value) {
        value.forEach(result => {
          this.results = result;
        });    
      }  
      if (refresher) {
          refresher.target.complete();
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
          this.inputAdd();
          return this.storage.set(STORAGE_KEY, value);
        }
        });        
      } else {
        return this.storage.set(STORAGE_KEY, item);
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

   async delete() {
    const toast = await this.toastController.create({
      message: `Keyword ${this.deleteValue} deleted !`,
      duration: 3000
    });
    toast.present();
   }

}
