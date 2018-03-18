import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Composants de template
import { HeaderComponent } from './components/template/header.component';
import { FooterComponent } from './components/template/footer.component';

// Composants d'authentification
import { LoginComponent } from './components/auth/login.component';
import { RegistrationComponent } from './components/auth/registration.component';

// Composants d'utilisateur
import { HomeComponent } from './components/user/home.component';
import { AboutComponent } from './components/user/about.component';
import { CategoryComponent } from './components/user/category.component';
import { ProductComponent } from './components/user/product.component';
import { ProfileComponent } from './components/user/profile.component';
import { CartComponent } from './components/user/cart.component';
import { PaiementComponent } from './components/user/paiement.component';

// Composants d'administrateur
import { PanelComponent } from './components/admin/panel.component';

// Services
import { UserService } from "./services/user.service";
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { CommentService } from './services/comment.service';
import { PurchaseService } from './services/purchase.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    AboutComponent,
    CategoryComponent,
    ProductComponent,
    ProfileComponent,
    CartComponent,
    PaiementComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'category/:category_id', component: CategoryComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'paiement', component: PaiementComponent },
      { path: 'admin', component: PanelComponent }
    ]),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    UserService,
    CategoryService,
    ProductService,
    CommentService,
    PurchaseService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
