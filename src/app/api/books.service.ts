import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  url = 'https://www.googleapis.com/books/v1/volumes?';
  apiKey = 'AIzaSyCkz-UoN3TDdo5DC33LnlpqAzpsFHU_FBI'; // <-- Enter your own key here!
  lang = 'fr';

  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }

  /**
  * Get data from the OmdbApi 
  * map the result to return only the results that we need
  * 
  * @param {string} title Search Term
  * @param {SearchType} type movie, series, episode or empty
  * @returns Observable with the search results
  */
  searchData(title: string): Observable<any> {
    return this.http.get(`${this.url}?q=${encodeURI(title)}&langRestrict=${this.lang}&key=${this.apiKey}`).pipe(
      map(results => results['Search'])
    );
  }
}
