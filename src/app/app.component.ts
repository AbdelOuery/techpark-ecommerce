import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  static loggedInStatus: Subject<boolean> = new Subject();
  loggedIn: boolean;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Recuperer l'utilisateur si il est connecte
    this.loggedIn = this.userService.getCurrentUser() ? true : false;
    this.updateCurrentUser();
  }

  updateCurrentUser() {
    // Mettre a jour l'etat loggedIn
    AppComponent.loggedInStatus.subscribe(response => {
      this.loggedIn = this.userService.getCurrentUser() ? true : false;
    });
  }
}
