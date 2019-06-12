import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { langRestrict } from '../../api/books.service';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'lang';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.page.html',
  styleUrls: ['./modal-settings.page.scss'],
})
export class ModalSettingsPage implements OnInit {

  private languages: Array<string>;
  private lang = langRestrict;
  private storedLang: string;
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private storage: Storage
  ) { }
 
  ngOnInit() {
    console.table(this.navParams);
    this.languages = this.navParams.data.lang;
    console.log(this.lang)
    this.storage.get(STORAGE_KEY).then((value) => {
      this.storedLang = value;
    });
  }
 
  async closeModal() {
    await this.modalController.dismiss()
  }

  async onDismiss() {
    console.log(this.lang);
    this.storage.set(STORAGE_KEY, this.lang)
  }
  
  


}
