import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError} from 'rxjs/operators';
import { Book } from '../model/book.interfaces';
import { Storage } from '@ionic/storage';

export enum SearchType {
  all = '',
  title = 'intitle:',
  author = 'inauthor:',
  publisher = 'inpublisher:'
}
// ISO 639-1 codes
const langRestrict = [
  {
    key: 'English',
    value: "en"
  },
  {
    key: 'French',
    value: "fr"
  },
  {
    key: "Italian",
    value: "it"
  },
  {
    key: "German",
    value: "de"
  },
];

export {langRestrict};


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private url = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyCkz-UoN3TDdo5DC33LnlpqAzpsFHU_FBI'; // <-- Enter your own key here!
  public maxResult: string;

  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient, private storage: Storage) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }



  /**
  * Get data from the Google Books API
  * map the result to return only the results that we need
  * 
  * @param {string} title Search Term
  * @param {SearchType} type author, title, publisher or empty
  * @param {langRestrict} string language
  * @returns Observable with the search results
  */
  searchData(title: string, type: SearchType, langRestrict: string, maxResult: string) : Observable<Book[]> {
    let url = `${this.url}?q=${type}${encodeURI(title)}&langRestrict=${langRestrict}&maxResults=${maxResult}&printType=all&key=${this.apiKey}`;
    return this.http.get<Book[]>(url, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError<Book[]>('searchData', [])
   ));
  }

  /**
  * Get the detailed information for an ID using the "i" parameter
  * 
  * @param {string} id ID to retrieve information
  * @returns Observable with detailed information
  */
  getDetails(id) : Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/${id}?key=${this.apiKey}`, this.httpOptions);
  }

  /**
  * Check if in storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns result
  */
  isFavorite(bookId, storageKey) {
    return this.getAllFavoriteBooks(storageKey).then(result => {
      return result.some(response => 
        response.id === bookId
      );
    });     
  }
  
  /**
  * Put in storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns the storage set result else the id of the book
  */
  favoriteBook(bookId, storageKey) {
    return this.getAllFavoriteBooks(storageKey).then(result => {
      if (result) {
        result.push(bookId);
        return this.storage.set(storageKey, result);
      } else {
        return this.storage.set(storageKey, [bookId]);
      }
    });
  }
 
  /**
  * Unset from storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns the storage set result
  */
  unfavoriteBook(bookId, storageKey) {
    return this.getAllFavoriteBooks(storageKey).then(result => {
      if (result) {
        var index = result.indexOf(bookId);
        result.splice(index, 1);
        return this.storage.set(storageKey, result);
      }
    });
  }
 
  /**
  * Get all books in the storage
  * 
  * @param {string} storageKey to retrieve information
  * @returns storage set
  */
  getAllFavoriteBooks(storageKey) {
    return this.storage.get(storageKey);
  }

  /**
  * Update item in storage
  * 
  * @param {arary} res contains the result
  * @param {array} value contains the array of information
  * @param {string} storageKey contains the key
  * @returns storage set
  */
  /* storeUpdate(res, value, storageKey) {
    this.getAllFavoriteBooks(storageKey).then(result => {
      result.forEach(item => {
        if(!item.value) {
          this.favoriteBook(value, storageKey)
        } else {
          res = [] = item
          res.value = value['value']
          res.key = value['key']
          this.storage.set(storageKey, [res])
        }
    });
  });
  } */
}
