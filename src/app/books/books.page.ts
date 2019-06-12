import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BooksService, SearchType, langRestrict } from '../api/books.service';
import { LoadingController, IonSearchbar, ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Book } from '../model/book.interfaces';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { ModalSettingsPage } from './modal-settings/modal-settings.page';


const STORAGE_KEY = 'lang';

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

  constructor(private booksService: BooksService, private loadingController: LoadingController, private storage: Storage, private network: Network, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.storage.get(STORAGE_KEY).then((value) => {
      this.storedLang = value;
    });
  }


  searchChanged() {
    // Call our service function which returns an Observable
    this.results$ = this.booksService.searchData(this.searchTerm, this.type, this.storedLang);
  }

  // Loading component
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 100,
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
