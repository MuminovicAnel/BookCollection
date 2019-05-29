import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Items } from '../model/book.interfaces'

export enum SearchType {
  all = '',
  title = 'intitle:',
  author = 'inauthor:',
  publisher = 'inpublisher:'
}
 

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  //public items: Items[];

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  url = 'https://www.googleapis.com/books/v1/volumes';
  apiKey = 'AIzaSyCkz-UoN3TDdo5DC33LnlpqAzpsFHU_FBI'; // <-- Enter your own key here!
  lang = 'fr';
  items 

  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }

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
  * Get data from the OmdbApi 
  * map the result to return only the results that we need
  * 
  * @param {string} title Search Term
  * @param {SearchType} type author, title, publisher or empty
  * @returns Observable with the search results
  */
  searchData(title: string, type: SearchType): Observable<Items> {
    return this.http.get<Items>(`${this.url}?q=${type}${encodeURI(title)}&langRestrict=${this.lang}&maxResults=40&printType=all&key=${this.apiKey}`, this.httpOptions).pipe(
      map(result => this.items = result['items']),
      catchError(this.handleError)
    );
  }

  /**
  * Get the detailed information for an ID using the "i" parameter
  * 
  * @param {string} id ID to retrieve information
  * @returns Observable with detailed information
  */
 getDetails(id) {
  return this.http.get(`${this.url}/${id}?key=${this.apiKey}`, this.httpOptions)
 }
}
