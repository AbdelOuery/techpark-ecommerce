import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { User } from '../../models/user';
import { Purchase } from '../../models/purchase';
import { HeaderComponent } from '../template/header.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, OnDestroy {
  state: string;
  user: User;
  purchaseList: Purchase[];
  output: any;
  private _subs: any = {};

  constructor(private userService: UserService,
              private purchaseService: PurchaseService,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    // L'utilisateur n'est pas connecte, renvoyer le vers l'accueil
    if(!this.user) {
      this.router.navigate(['']);
    }

    this.title.setTitle(this.user.firstName + ' ' + this.user.lastName);
    this.summary();
  }

  summary() {
    this.state = 'summary';
  }

  update() {
    this.state = 'update';
  }

  purchases() {
    this.state = 'purchases';

    // Recuperer ses achats
    this._subs.purchases = this.purchaseService.getPurchasesByUser(this.user.id, this.userService.getToken())
      .subscribe(data => this.purchaseList = data);
  }

  onSubmit() {
    const token = this.userService.getToken();
    const oldEmail = this.userService.getCurrentUser().email;

    // Tester le mot de passe actuelle
    this._subs.credsTest = this.userService.testUserPassword(oldEmail, this.user.password, token)
      .subscribe(data => {

        // Si le mot de passe est correcte
        if(data['notice']) {

          // Modifier l'utilisateur
          this._subs.update = this.userService.updateUser(this.user.id, token, this.user).subscribe(data => {

            // Si l'email n'est pas deja utilise
            if(data['notice']) {

              // Cree le nouveau objet
              const userObject = {
                id: this.user.id,
                email: this.user.email,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                birthDate: this.user.birthDate,
                dateAdded: this.user.dateAdded,
                admin: this.user.admin
              };

              // Stocker le nouveau utilisateur avec son jeton
              localStorage.setItem('current_user', JSON.stringify({
                user: userObject,
                token: token
              }));

              // Actualiser le header
              HeaderComponent.loggedInStatus.next(true);

              this.output = { notice: 'Votre compte à été bien modifié' };

            } else {
              this.output = { error: 'Cet email est déja utilisé' };
            }
          });
        } else {
          this.output = { error: 'Mot de passe actuelle incorrecte' };
        }
    }, err => console.log(err));
  }

  ngOnDestroy() {
    for(let sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
