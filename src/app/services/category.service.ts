import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Category } from '../models/category';
import { API_URL } from '../config/url';

@Injectable()
export class CategoryService {
  private _url: string = `${API_URL}/api/category`;

  constructor(private http: HttpClient) { }

  /**
   * Recuperer toutes les categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this._url + '/all');
  }

  /**
   * Recuperer une categorie par identifiant
   * 
   * @param id number
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(this._url + `/${id}`);
  }

  /**
   * Inserer une categorie
   * 
   * @param category  Category
   * @param authToken string
   */
  createCategory(category: Category, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/create', category, {headers: headers});
  }

  /**
   * Met a jout une categorie
   * 
   * @param id        number
   * @param authToken string
   * @param category  Category
   */
  updateCategory(id: number, authToken: string, category: Category): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.put<string>(this._url + `/update/${id}`, category, {headers: headers});
  }

  /**
   * Supprimer une categorie
   *
   * @param id        number
   * @param authToken string
   */
  deleteCategory(id: number, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.delete<string>(this._url + `/delete/${id}`, {headers: headers});
  }
}
