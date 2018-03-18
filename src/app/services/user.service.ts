import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';
import { API_URL } from '../config/url';

@Injectable()
export class UserService {
  private _url: string = `${API_URL}/api/user`;
  private _storageData: any;
  private _currentUser: User;
  private _token: string;

  constructor(private http: HttpClient) {
    // Initialiser l'utilisateur connecte avec son jeton
    this.getCurrentUser();
    this.getToken();
  }

  /**
   * Fait la lecture du localStorage
   */
  parseStorage() {
    // Recuperer les donnees stocke dans le localStorage
    this._storageData = JSON.parse(localStorage.getItem('current_user'));
  }

  /**
   * Recuperer l'utilisateur connecte depuis les donnees stocke dans le localStorage
   */
  getCurrentUser(): User {
    this.parseStorage();
    this._currentUser = this._storageData ? this._storageData.user : null;
    return this._currentUser;
  }

  /**
   * Recuperer le jeton d'authentification depuis les donnees stocke dans le localStorage
   */
  getToken(): string {
    this.parseStorage();
    this._token = this._storageData ? this._storageData.token : null;
    return this._token;
  }

  /**
   * Recuperer tous les utilisateurs
   *
   * @param authToken string
   */
  getUsers(authToken: string): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<User[]>(this._url + '/all', {headers: headers});
  }

  /**
   * Recuperer un utilisateur par identifiant
   * 
   * @param id        number
   * @param authToken string
   */
  getUserById(id: number, authToken: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<User>(this._url + `/${id}`, {headers: headers});
  }

  /**
   * Recuperer un utilisateur par email
   * 
   * @param email     string
   * @param authToken string
   */
  getUserByEmail(email: string, authToken: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<User>(this._url + `/email/'${email}'`, {headers: headers});
  }

  /**
   * Tester si les donnees d'authentification d'un utilisateur sont valide
   * 
   * @param email     string
   * @param password  string
   * @param authToken string
   */
  testUserPassword(email: string, password: string, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.get<string>(this._url + `/creds/'${email}'&'${password}'`, {headers: headers});
  }

  /**
   * Inserer un utilisateur
   * 
   * @param user User
   */
  createUser(user: User): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/create', user, {headers: headers});
  }

  /**
   * Met a jour un utilisateur
   *
   * @param id        number
   * @param authToken string
   * @param user      User
   */
  updateUser(id: number, authToken: string, user: User): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken)
                                     .set('Content-Type', 'application/json');
    return this.http.put<string>(this._url + `/update/${id}`, user, {headers: headers});
  }

  /**
   * Supprimer un utilisateur
   * 
   * @param id        number
   * @param authToken string
   */
  deleteUser(id: number, authToken: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', authToken);
    return this.http.delete<string>(this._url + `/delete/${id}`, {headers: headers});
  }

  /**
   * Essayer d'authentifier un utilisateur
   * 
   * @param user User
   */
  login(user: User): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<string>(this._url + '/login', user, {headers: headers});
  }

  /**
   * Deconnecter un utilisateur (supprimer son objet + jeton depuis le localStorage)
   */
  logout() {
    localStorage.removeItem('current_user');
  }
}
