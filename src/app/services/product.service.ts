
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Product } from '../models/product';
import { API_URL } from '../config/url';

@Injectable()
export class ProductService {
  private _url: string = `${API_URL}/api/product`;

  constructor(private http: HttpClient) { }

  /**
   * Recuperer tous les produits
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this._url + '/all');
  }

  /**
   * Recuperer les derniers 9 produits ajoute
   */
  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this._url + '/latest');
  }

  /**
   * Recuperer les produits d'une categorie
   *
   * @param categoryId number
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this._url + `/category/${categoryId}`);
  }

  /**
   * Recuperer un produit par identifiant
   * 
   * @param id number
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this._url + `/${id}`);
  }

  /**
   * Inserer un produit
   * 
   * @param product   Product
   * @param authToken string
   */
  createProduct(product: Product, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/create', product, {headers: headers});
  }

  /**
   * Met a jour un produit
   * 
   * @param id        number
   * @param authToken string
   * @param product   Product
   */
  updateProduct(id: number, authToken: string, product: Product): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.put<string>(this._url + `/update/${id}`, product, {headers: headers});
  }

  /**
   * Supprimer un produit
   * 
   * @param id        number
   * @param authToken string
   */
  deleteProduct(id: number, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.delete<string>(this._url + `/delete/${id}`, {headers: headers});
  }
}
