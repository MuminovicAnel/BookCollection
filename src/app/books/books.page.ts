import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BooksService, SearchType, langRestrict } from '../api/books.service';
import { NetworkService, ConnectionStatus } from '../services/network.service'
import { LoadingController, IonSearchbar, ModalController, Platform, ToastController} from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Book } from '../model/book.interfaces';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { ModalSettingsPage } from './modal-settings/modal-settings.page';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { validate } from 'isbn-validate';


const storageLang = 'lang';
const storageMaxResult = 'maxResult';
const STORAGE_KEY = 'wishListBooks';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss']
})
export class BooksPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;

  private results$: Observable<Book[]>;
  private searchTerm = '';
  private type: SearchType = SearchType.all;
  private lang = langRestrict;
  private storedLang: Observable<Book[]>;
  private maxResults: number;
  private isbnResult$: Book;
  private disabledSearch = false;
  private disabledScan = false;
  private disabledList = false;

  private scannedData: {};
  private barcodeScannerOptions: BarcodeScannerOptions;

  private connected: Subscription;
  private disconnected: Subscription;

  constructor(private booksService: BooksService,
              private loadingController: LoadingController,
              private storage: Storage,
              private network: Network,
              private modalCtrl: ModalController,
              private plt: Platform,
              private barcodeScanner: BarcodeScanner,
              private toastController: ToastController,
              private router: Router,
              private networkService: NetworkService)
              {
              // Options
              this.barcodeScannerOptions = {
              showTorchButton: true,
              showFlipCameraButton: true
              };
              }

  ngOnInit() {   
    this.plt.ready().then(() => {
      this.check();
      this.loadData();
    });
  }

  check() {
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.online();
          this.disabledScan = false;
          this.disabledSearch = false;
          this.disabledList = false;
        } else {
          this.offline();
          this.disabledSearch = true;
          this.disabledScan = true;
          this.disabledList = true;
        }
      });
    
  }
  async online(){
    const toast = await this.toastController.create({
      message: `You are now connected`,
      duration: 3000
    })
    toast.present();
  }
  async offline() {
    const toast = await this.toastController.create({
      message: `You are disconnected`,
      duration: 3000
    })
    toast.present();
  }

  async scanBarcode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedData =  barcodeData;
        if(validate(this.scannedData['text'])) {
        this.booksService.getISBN(this.scannedData['text']).subscribe(async (book: Book[])  => {
          if(book) {
            this.booksService.favoriteBook(book['items'], STORAGE_KEY).then(result => {
              this.isbnResult$ = result;
            });
            const toast = await this.toastController.create({
              translucent: true,
              duration: 5000,
              buttons: [
                {
                  side: 'start',
                  icon: 'star',
                  text: 'Added in your wishlist !',
                  handler: () => {
                    this.router.navigateByUrl('tabs/books-scan');
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
          } else {
            alert("Nous n'avons trouvé aucun livre correspondant à cet ISBN.");
          }
        });
         } else {
          alert("Ce n'est pas un ISBN, veuillez fournir un ISBN barcode.");
        } 
      })
      .catch(err => {
        console.log('Error', err);
        alert('Il y a une erreur durant le scan, veuillez réessayer')
      });
  }

  async loadData() {
    this.storage.keys().then(item => {
      if (item.length != 0) {
        this.booksService.getAllFavoriteBooks(storageLang).then(value => {
          value.forEach(item => {
            this.storedLang = item['value'];
          });
        });
        this.booksService.getAllFavoriteBooks(storageMaxResult).then((value) => {
          value.forEach(item => {
            this.maxResults = item.value;
          });
        });
      } else {
        this.openModal();
      }
    });
  }


  searchChanged() {
    // Call our service function which returns an Observable
    this.results$ = this.booksService.searchData(this.searchTerm, this.type, this.storedLang, this.maxResults);
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

    return await loading.present();

  }
   async afterReload() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved. Refresh...',
      duration: 2000
    });
    toast.present();
   }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalSettingsPage,
      componentProps: {
        lang: this.lang,
      }
    });

    modal.onDidDismiss().then(() => {
      this.afterReload();
      setTimeout(function() { window.location.replace('/'); }, 3000);
    });

    return await modal.present();
  }

}
