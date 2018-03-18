import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Purchase } from '../models/purchase';
import { API_URL } from '../config/url';

@Injectable()
export class PurchaseService {
  private _url: string = `${API_URL}/api/purchase`;

  constructor(private http: HttpClient) { }

  /**
   * Recuperer tous les achats
   * 
   * @param authToken string
   */
  getPurchases(authToken: string): Observable<Purchase[]> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<Purchase[]>(this._url + `/all`, {headers: headers});
  }

  /**
   * Recuperer tous les achats d'un utilisateur
   * 
   * @param id        number
   * @param authToken string
   */
  getPurchasesByUser(id: number, authToken: string): Observable<Purchase[]> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<Purchase[]>(this._url + `/user/${id}`, {headers: headers});
  }

  /**
   * Inserer un achat
   * 
   * @param purchase  Purchase
   * @param authToken string
   */
  createPurchase(purchase: Purchase, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/create', purchase, {headers: headers});
  }
}
