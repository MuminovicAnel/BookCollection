import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BooksService, SearchType, langRestrict } from '../api/books.service';
import { LoadingController, IonSearchbar, ModalController, Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Book } from '../model/book.interfaces';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { ModalSettingsPage } from './modal-settings/modal-settings.page';


const storageLang = 'lang';
const storageMaxResult = 'maxResult';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss']
})
export class BooksPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;
  
  public myData = new BehaviorSubject([]);
  private results$: Observable<Book[]>;
  private searchTerm = '';
  private type: SearchType = SearchType.all;
  private lang = langRestrict;
  private storedLang: string;
  private maxResults: number;

  constructor(private booksService: BooksService, private loadingController: LoadingController, private storage: Storage, private network: Network, private modalCtrl: ModalController, private plt: Platform) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadData();
    });
      
  }

  async loadData () {
    this.storage.keys().then(item => {
      if(item.length !== 0 || item){
        this.storage.get(storageLang).then((value) => {
          console.log(value)
          value.forEach(item => {
            this.storedLang = item.value;   
          });            
        });
        this.storage.get(storageMaxResult).then((value) => {
          console.log(value)
          value.forEach(item => {
            this.maxResults = item.value;
          });                
        });
      } else {
        this.openModal()
      }
    });
  }


  async searchChanged() {
    // Call our service function which returns an Observable
    this.results$ = this.booksService.searchData(this.searchTerm, this.type, this.storedLang, this.maxResults);
    return await this.results$;
  }

  // Loading component
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 50,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });

    loading.onDidDismiss().then(() => {
      this.searchBar.setFocus();
    });

    return await loading.present();

  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalSettingsPage,
      componentProps: {
        "lang": this.lang,
      }
    });
 
    return await modal.present();
  }

}
