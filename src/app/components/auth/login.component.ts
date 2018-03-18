import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../template/header.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  user: any = {};
  output: any;
  private _subs: any = {};
  private _user: User;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    if(this.userService.getCurrentUser()) {
      this.router.navigate(['']);
    }
    if(this.activatedRoute.snapshot.queryParams['message'] === 'success') {
      this.output = { 'notice': 'Votre compte à été crée avec succès' };
    }
  }

  onSubmit() {
    // Essayer de s'authentifier
    this._subs.login = this.userService.login(this.user).subscribe(data => {

      // Recuperer le jeton JWT
      const token = data['Authorization'];

      this._subs.user = this.userService.getUserByEmail(this.user.email, token).subscribe(data => {

        // Creer l'objet d'utilisateur a stocker
        const userObject = {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: data.birthDate,
          dateAdded: data.dateAdded,
          admin: data.admin
        };

        // Sauvgarder l'utilisateur et son jeton dans le localStorage
        localStorage.setItem('current_user', JSON.stringify({
          user: userObject,
          token: token
        }));

        // Actualiser les composants App et Header pour afficher le panier et le nom d'utilisateur en haut
        HeaderComponent.loggedInStatus.next(true);
        AppComponent.loggedInStatus.next(true);

        // L'utilisateur est connecte, renvoyer vers l'accueil
        this.router.navigate(['']);
      });
    }, err => this.output = { 'error': 'Données invalides' });
  }

  ngOnDestroy() {
    for(let sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
