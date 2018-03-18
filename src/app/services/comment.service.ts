import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Comment } from '../models/comment';
import { API_URL } from '../config/url';

@Injectable()
export class CommentService {
  private _url: string = `${API_URL}/api/comment`;

  constructor(private http: HttpClient) { }

  /**
   * Recuperer tous les commentaires
   * 
   * @param authToken string
   */
  getComments(authToken: string): Observable<Comment[]> {
    const headers = new HttpHeaders().set('Authorization', authToken)
    return this.http.get<Comment[]>(this._url + '/all', {headers: headers});
  }

  /**
   * Recuperer les commentaires d'un produit
   *
   * @param productId number
   */
  getCommentsByProduct(productId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this._url + `/product/${productId}`);
  }

  /**
   * Recuperer les commentaires d'un utilisateur
   *
   * @param userId number
   */
  getCommentsByUser(userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this._url + `/user/${userId}`);
  }

  /**
   * Recuperer un commentaire par identifiant
   *
   * @param id number
   */
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(this._url + `/${id}`);
  }

  /**
   * Inserer un commentaire
   *
   * @param comment   Comment
   * @param authToken string
   */
  createComment(comment: Comment, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/create', comment, {headers: headers});
  }

  /**
   * Met a jour un commentaire
   *
   * @param id        number
   * @param authToken string
   * @param comment   Comment
   */
  updateComment(id: number, authToken: string, comment: Comment): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.put<string>(this._url + `/update/${id}`, comment, {headers: headers});
  }

  /**
   * Supprimer un commentaire
   *
   * @param id        number
   * @param authToken string
   */
  deleteComment(id: number, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.delete<string>(this._url + `/delete/${id}`, {headers: headers});
  }
}
