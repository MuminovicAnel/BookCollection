import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BooksService, SearchType, langRestrict } from '../api/books.service';
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

  public myData = new BehaviorSubject([]);
  private results$: Observable<Book[]>;
  private searchTerm = '';
  private type: SearchType = SearchType.all;
  private lang = langRestrict;
  private storedLang: string;
  private maxResults: number;
  private isbnResult$: Observable<Book[]>;

  private scannedData: {};
  private barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private booksService: BooksService,
              private loadingController: LoadingController,
              private storage: Storage,
              private network: Network,
              private modalCtrl: ModalController,
              private plt: Platform,
              private barcodeScanner: BarcodeScanner,
              private toastController: ToastController,
              private router: Router)
              {
              // Options
              this.barcodeScannerOptions = {
              showTorchButton: true,
              showFlipCameraButton: true
              };
              }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadData();
    });

  }

  async scanBarcode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedData =  barcodeData;
        alert('livre ' + this.scannedData['text']);
        //if(validate(this.scannedData['text'])) {
        this.booksService.getISBN(this.scannedData['text']).subscribe(async (book: Book)  => {
          console.log(book)
          if(book) {
            this.booksService.favoriteBook(book, STORAGE_KEY).then(result => {
              console.log(result);
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
                    console.log('Favorite clicked');
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
       /*  } else {
          alert("Ce n'est pas un ISBN, veuillez fournir un ISBN barcode.");
        } */
      })
      .catch(err => {
        console.log('Error', err);
        alert('Il y a une erreur durant le scan, veuillez réessayer')
      });
  }

  async loadData() {
    this.storage.keys().then(item => {
      console.log(item)
      if (item.length != 0) {
        console.log(this.storedLang);
        this.booksService.getAllFavoriteBooks(storageLang).then((value) => {
          console.log(value);
          value.forEach(item => {
            this.storedLang = item.value;
          });
        });
        this.booksService.getAllFavoriteBooks(storageMaxResult).then((value) => {
          console.log(value);
          value.forEach(item => {
            this.maxResults = item.value;
          });
        });
      } else {
        this.openModal();
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
      duration: 100,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });

    /* loading.onDidDismiss().then(() => {
      this.searchBar.setFocus();
    }); */

    return await loading.present();

  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalSettingsPage,
      componentProps: {
        lang: this.lang,
      }
    });

    return await modal.present();
  }

}
