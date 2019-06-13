import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PickerController } from '@ionic/angular';
import { langRestrict } from '../../api/books.service';
import { Storage } from '@ionic/storage';
import { PickerColumnOption, PickerOptions } from '@ionic/core';
import { BooksService, } from '../../api/books.service';

const STORAGE_KEY = 'settings';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.page.html',
  styleUrls: ['./modal-settings.page.scss'],
})
export class ModalSettingsPage implements OnInit {

  private languages: Array<string>;
  private lang = [] = langRestrict;
  private storedLang: string;
  private numbers: PickerColumnOption[];
  private results = "";
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private storage: Storage,
    private pickerCtrl: PickerController,
    private booksService: BooksService
  ) {
    this.numbers = Array.from(new Array(31), (x,i) => i+10);
   }
 
  ngOnInit() {
    console.table(this.navParams);
    this.languages = this.navParams.data.lang;
    console.log(this.lang)
    this.storage.get(STORAGE_KEY).then(value => {
      this.storedLang = value['key'];
    });
    console.log(this.numbers)
  }
 
  async closeModal() {
    await this.modalController.dismiss()
    console.log(this.lang);
    this.languages.forEach(item => {
      if(item['value'] === this.lang) {
        this.lang = item;
        console.log(this.lang)
      }
    });
    console.log(this.lang)
    this.booksService.getAllFavoriteBooks(STORAGE_KEY).then(result => {
        console.log(this.lang['value'])
        console.log(result.value)
        if(result.value === this.lang['value']) {
          //this.booksService.favoriteBook(this.lang, STORAGE_KEY)
        } else {
          let res = result
          console.log(res.value)
            res.value = this.lang['value']
            res.key = this.lang['key']
          this.storage.set(STORAGE_KEY, res);
        }
    });  
  }

  // Picker 
  async pickerComp() {
    let options = [];
    console.log(options)
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
      console.log(data)
      this.storage.set(STORAGE_KEY, this.numbers)
      let col = await picker.getColumn('MaxResult');
      console.log(col)
      this.results = col.options[col.selectedIndex].text;
      console.log(this.results)
    });

    return await picker.present();

  }


}
