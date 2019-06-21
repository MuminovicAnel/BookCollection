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
    text: 'English',
    value: "en"
  },
  {
    text: 'French',
    value: "fr"
  },
  {
    text: "Italian",
    value: "it"
  },
  {
    text: "German",
    value: "de"
  },
];

export {langRestrict};


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  httpOptions = {
    //headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private url = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyCkz-UoN3TDdo5DC33LnlpqAzpsFHU_FBI'; // <-- Enter your own key here!
  public maxResult: number;

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
  searchData(title: string, type: SearchType, langRestrict: string, maxResult: number) : Observable<Book[]> {
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
    return this.http.get<Book[]>(`${this.url}/${id}?key=${this.apiKey}`, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError<Book[]>('getDetails', [])
   ));
  }

  /**
  * Get a book by his isbn number
  * 
  * @param {string} isbn ID to retrieve information
  * @returns Observable with detailed information
  */
 getISBN(isbn: string) : Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}?q=isbn:${isbn}&key=${this.apiKey}`, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError<Book[]>('getISBN', [])
   ));
  }

  /**
  * Check if in storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns result
  */
  isFavorite(bookId: Book, storageKey: string): Promise<any> {
    return this.getAllFavoriteBooks(storageKey).then(result => {
      if (result) {
        return result.some(response =>
          response.title === bookId
        );
      }
    });
  }
  
  /**
  * Put in storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns the storage set result else the id of the book
  */
  favoriteBook(bookId: Book, storageKey: string): Promise<Book> {
    return this.getAllFavoriteBooks(storageKey).then((result: Book[]) => {
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
  unfavoriteBook(bookId: Book, storageKey: string): Promise<Book> {
    return this.getAllFavoriteBooks(storageKey).then((result: Book[]) => {
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
  getAllFavoriteBooks(storageKey: string): Observable<Book[]> {
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
  storeUpdate(value: any, storageKey: string): Promise<any> {
    return this.getAllFavoriteBooks(storageKey).then(result => {
      if(result && result.length === 0) {
        result.forEach(item => {
          if(item.value === value) {
            return null
          } else {
            let res = [] = item
            res.value = value['value']
            res.text = value['text']
            return this.storage.set(storageKey, [res])
          }
        });
      } else {
        let res = []
        res.push({
          text: value['text'], value: value['value']
        })
        return this.storage.set(storageKey, res)
      }      
  });
  }
}
