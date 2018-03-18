import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  categories: Category[];
  user: User;
  static loggedInStatus: Subject<boolean> = new Subject();
  static categories: Subject<boolean> = new Subject();
  private _loggedIn: boolean = false;
  private _subs: any = {};

  constructor(private categoryService: CategoryService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    // Recuperer les categories
    this._subs.categories = this.categoryService.getCategories()
      .subscribe(data => this.categories = data);

    // Recuperer l'utilisateur connecte
    this.user = this.userService.getCurrentUser();

    // Mettre a jour le composant header pour afficher l'utilisateur recupere
    this.updateLoggedInStatus();
    this.updateCategories();
  }

  updateLoggedInStatus() {
    this._subs.loggedInStatus = HeaderComponent.loggedInStatus.subscribe(response => {
      this.user = this.userService.getCurrentUser();
    });
  }

  updateCategories() {
    this._subs.categoriesUpdate = HeaderComponent.categories.subscribe(response => {
      this._subs.categories = this.categoryService.getCategories()
        .subscribe(data => this.categories = data);
    });
  }

  logoutCurrentUser() {
    // Deconnecter l'utilisater, actualiser les composants, renvoyer vers l'accueil
    this.userService.logout();
    HeaderComponent.loggedInStatus.next(true);
    AppComponent.loggedInStatus.next(true);
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    for(let sub of this._subs) {
      sub.unsubcribe();
    }
  }
}
