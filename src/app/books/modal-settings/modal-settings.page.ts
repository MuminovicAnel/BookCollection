import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PickerController } from '@ionic/angular';
import { langRestrict } from '../../api/books.service';
import { Storage } from '@ionic/storage';
import { PickerOptions } from '@ionic/core';
import { BooksService, } from '../../api/books.service';

const storageLang = 'lang';
const storageMaxResult = 'maxResult';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.page.html',
  styleUrls: ['./modal-settings.page.scss'],
})
export class ModalSettingsPage implements OnInit {

  private languages: Array<string>;
  private lang = {} = langRestrict;
  private storedLang: string;
  private number: string;
  private textNumber = '';
  private maxResult: any;
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private storage: Storage,
    private pickerCtrl: PickerController,
    private booksService: BooksService
  ) { }
 
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
 
  async closeModal() {
    await this.modalController.dismiss()
    this.languages.forEach(item => {
      if(item['value'] === this.lang) {
        let res: any = item
        this.lang = res;
      }
    });
      // Set the language setting and overwrite previous value
    if(this.lang === undefined) {
      this.booksService.storeUpdate(this.lang, storageLang)
    }
    if(this.maxResult) {
      this.booksService.storeUpdate(this.maxResult, storageMaxResult)
    }

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
      let col = await picker.getColumn('MaxResult');
      this.textNumber = col.options[col.selectedIndex].text;
      this.maxResult = col.options[col.selectedIndex];
    });

    return await picker.present();

  }


}
