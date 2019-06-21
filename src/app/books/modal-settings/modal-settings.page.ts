import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PickerController } from '@ionic/angular';
import { langRestrict } from '../../api/books.service';
import { Storage } from '@ionic/storage';
import { PickerOptions } from '@ionic/core';
import { BooksService, } from '../../api/books.service';
import { SelectTheme } from 'ionic-angular-theme-switch';
import { Router } from '@angular/router';

const storageLang = 'lang';
const storageMaxResult = 'maxResult';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.page.html',
  styleUrls: ['./modal-settings.page.scss'],
})
export class ModalSettingsPage implements OnInit {

  public themes: SelectTheme[] = [
    {
      key: 'default',
      theme: {}
    },
    {
      key: 'vibrant',
      label: 'Vibrant',
      theme: {
        primary: '#ff7f50',
        secondary: '#17deee',
        tertiary: '#ff4162',
        success: '#39ff14',
        warning: '#ffce00',
        danger: '#f04141',
        light: '#f4f5f8',
        medium: '#989aa2',
        dark: '#222428',
       
        'ion-background-color': '#778899',
       
        /* Component Colors */
        'ion-backdrop-color': '#556677',
        'ion-overlay-background-color': '#667788',
       
        'ion-border-color': '#5bff76',
        'ion-box-shadow-color': '#000',
       
        'ion-item-background': '#667788',
        'ion-item-border-color': '#5bff76'
       }
    },
    {
      key: 'dark',
      label: 'Dark',
      theme: {
        'ion-background-color': '#171717',
        'ion-text-color': '#fff',
       
        /* Component Colors */
        'ion-backdrop-color': '#2e2e2e',
        'ion-overlay-background-color': '#454545',
       
        'ion-border-color': '#5d5d5d',
        'ion-box-shadow-color': '#000',
       
        'ion-item-background': '#2e2e2e',
        'ion-item-background-activated': '#454545'
      }
    },
    {
      key: 'oceanic',
      label: 'Oceanic',
      theme: {
        primary: '#549ee7',
        secondary: '#5fb3b3',
        tertiary: '#fac863',
        success: '#90d089',
        warning: '#f99157',
        danger: '#ec5f67',
        light: '#d8dee9',
        medium: '#65737e',
        dark: '#1b2b34',
       
        'ion-background-color': '#1b2b34',
        'ion-text-color': '#fff',
       
        /* Component Colors */
        'ion-backdrop-color': '#1b2b34',
        'ion-overlay-background-color': '#142129',
       
        'ion-border-color': '#1b2b34',
        'ion-box-shadow-color': '#000',
       
        'ion-item-background': '#343d46',
        'ion-item-background-activated': '#232b34'
       }
    }
    ];

  private languages: Array<string>;
  private lang = {} = langRestrict;
  private storedLang: any;
  private number: string;
  private textNumber = '';
  private maxResult: any;
  private disabled = true;
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private storage: Storage,
    private pickerCtrl: PickerController,
    private booksService: BooksService,
    private router: Router
  ) { 
  }
 
  ngOnInit() {
    console.table(this.navParams);
    this.languages = this.navParams.data.lang;
    this.storage.get(storageLang).then(value => {
      value.forEach(item => {
        console.log(item)
        if(item) {
          this.storedLang = item['text'];
        }
      });
    });
    this.storage.get(storageMaxResult).then(value => {
      value.forEach(item => {
        console.log(item)
        if(item) {
          this.number = item['value'];
        }
      });
    });
  }

  compareFn(o1, o2): Boolean{
    if(o1 == null || o2 == null){
      return false;
    }
    return o1.value === o2;
  }

  enableSave() {
    this.disabled = false;
    this.languages.forEach(item => {
      if(item['value'] === this.lang) {
        let res: any = item
        this.storedLang = res['text'];
      }
    });
  }
  

  storeSettings() {
    this.languages.forEach(item => {
      if(item['value'] === this.lang) {
        let res: any = item
        this.lang = res;
      }
    });

    this.disabled = true;
    // Set the language setting and overwrite previous value
    if(Object.keys(this.lang).length === 2) {
      this.booksService.storeUpdate(this.lang, storageLang)
    }
    if(this.maxResult) {
      console.log(this.maxResult)
      this.booksService.storeUpdate(this.maxResult, storageMaxResult)
    }
    
  }
 
  closeModal() {
    this.modalController.dismiss([this.maxResult, this.lang]);
    this.router.navigateByUrl('/books');
  }

  // Picker 
  async pickerComp() {
    let options = [];
    for (let i = 10; i <= 40; i++) {
      options.push({
        text: i.toString(), value: i

      })
    } 
    let opts: PickerOptions = {
      cssClass: 'academy-picker',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
        }
      ],
      columns: [
        {
        name: 'MaxResult',
        options: options
      }
      ]
    };

    let picker = await this.pickerCtrl.create(opts);

    picker.onDidDismiss().then(async data => {
      this.disabled = false;
      let col = await picker.getColumn('MaxResult');
      this.textNumber = col.options[col.selectedIndex].text;
      this.maxResult = col.options[col.selectedIndex];
    });

    return await picker.present();

  }


}
