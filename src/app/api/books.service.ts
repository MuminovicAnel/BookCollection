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
 
const STORAGE_KEY = 'favoriteBooks';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private url = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyCkz-UoN3TDdo5DC33LnlpqAzpsFHU_FBI'; // <-- Enter your own key here!
  private lang = 'fr';

  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient, private storage: Storage) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }



  /**
  * Get data from the Google Books API
  * map the result to return only the results that we need
  * 
  * @param {string} title Search Term
  * @param {SearchType} type author, title, publisher or empty
  * @returns Observable with the search results
  */
  searchData(title: string, type: SearchType) : Observable<Book[]> {
    let url = `${this.url}?q=${type}${encodeURI(title)}&langRestrict=${this.lang}&maxResults=40&printType=all&key=${this.apiKey}`;
    return this.http.get<Book[]>(url, this.httpOptions).pipe(
      retry(3),
      catchError(err => {
      console.log(err);
     return of(null);
      })
   );
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
  isFavorite(bookId) {
    return this.getAllFavoriteBooks().then(result => {
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
  favoriteBook(bookId) {
    return this.getAllFavoriteBooks().then(result => {
      if (result) {
        result.push(bookId);
        return this.storage.set(STORAGE_KEY, result);
      } else {
        return this.storage.set(STORAGE_KEY, [bookId]);
      }
    });
  }
 
  /**
  * Unset from storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns the storage set result
  */
  unfavoriteBook(bookId) {
    return this.getAllFavoriteBooks().then(result => {
      if (result) {
        var index = result.indexOf(bookId);
        result.splice(index, 1);
        return this.storage.set(STORAGE_KEY, result);
      }
    });
  }
 
  /**
  * Get all books in the storage
  * 
  * @param {string} bookId ID to retrieve information
  * @returns storage set
  */
  getAllFavoriteBooks() {
    return this.storage.get(STORAGE_KEY);
  }
}
