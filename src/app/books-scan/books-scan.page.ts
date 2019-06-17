import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-books-scan',
  templateUrl: 'books-scan.page.html',
  styleUrls: ['books-scan.page.scss']
})
export class BooksScanPage implements OnInit {

  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner) {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedData =  JSON.stringify(barcodeData);
        alert("Barcode data " + this.scannedData);
        if(this.scannedData['cancelled']) {}
      })
      .catch(err => {
        console.log("Error", err);
      });
  }


  
  


}
