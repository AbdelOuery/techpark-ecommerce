import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'registration-component',
  templateUrl: './registration.component.html'
})

export class RegistrationComponent implements OnInit, OnDestroy {
  user: any = {};
  output: any;
  private _sub;

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    // Si l'utilisateur est deja connecte, renvoyer le vers l'accueil
    if(this.userService.getCurrentUser()) {
      this.router.navigate(['']);
    }
  }

  onSubmit() {
    // Essayer d'inserer le nouveau utilisateur
    this._sub = this.userService.createUser(this.user).subscribe(data => {
      if(data['notice'] != null) {
        this.router.navigate(['login'], { queryParams: { message: 'success' }});
      } else {
        this.output = { 'error': 'Cet Email est déja utilisé' };
      }
    });
  }

  ngOnDestroy() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
  }
}
