import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Purchase } from '../../models/purchase';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { CommentService } from '../../services/comment.service';
import { CategoryService } from '../../services/category.service';
import { HeaderComponent } from '../template/header.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'panel-component',
  templateUrl: './panel.component.html'
})

export class PanelComponent implements OnInit, OnDestroy {
  state: string;
  modalTitle: string;
  updateId: number = null;

  private _token: string;

  purchaseList: Purchase[];
  productList: Product[];
  categoryList: Category[];
  userList: User[];
  commentList: any;

  category: any = {};
  product: any = {};
  _user: User;
  user: any = {};

  output: any;
  private _subs: any = {};

  constructor(private userService: UserService,
              private purchaseService: PurchaseService,
              private commentService: CommentService,
              private categoryService: CategoryService,
              private productService: ProductService,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Panneau de configuration');

    this._user = this.userService.getCurrentUser();
    this._token = this.userService.getToken();

    if(!this._user || !this._user.admin) {
      this.router.navigate(['']);
    }

    this.purchases();
  }


  purchases() {
    this.cancel();
    this.state = 'purchases';

    // Recuperer tous les achats
    this._subs.purchases = this.purchaseService.getPurchases(this._token)
      .subscribe(data => this.purchaseList = data);
  }

  products() {
    this.cancel();
    this.state = 'products';
    this.modalTitle = 'Ajouter un Produit';

    // Recuperer tous les produits
    this._subs.products = this.productService.getProducts()
      .subscribe(data => this.productList = data);

    // Recuperer toutes les categories
    this._subs.categories = this.categoryService.getCategories()
      .subscribe(data => this.categoryList = data);
  }

  categories() {
    this.cancel();
    this.state = 'categories';
    this.modalTitle = 'Ajouter une Catégorie';

    // Recuperer toutes les categories
    this._subs.categories = this.categoryService.getCategories()
      .subscribe(data => this.categoryList = data);
  }

  users() {
    this.cancel();
    this.state = 'users';
    this.modalTitle = 'Ajouter un Utilisateur';

    // Recuperer tous les utilisateurs
    this._subs.users = this.userService.getUsers(this._token)
      .subscribe(data => this.userList = data);
  }

  comments() {
    this.cancel();
    this.state = 'comments';

    // Recuperer tous les commentaires
    this._subs.comments = this.commentService.getComments(this._token)
      .subscribe(data => this.commentList = data);
  }

  onSubmit() {
    switch(this.state) {
      case 'categories':

        // Inserer la categorie
        this._subs.create = this.categoryService.createCategory(this.category, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Catégorie crée avec succes' } : null;

            // Actualiser la page et le header pour afficher les nouveaux categories
            this.categories();
            HeaderComponent.categories.next(true);
          });
        break;

      case 'products':
        // Referencer la categorie dans le produits
        this.product.category = { id: this.product.categoryId };
        delete this.product.categoryId;

        // Ajouter des sauts de ligne
        this.product.description = this.product.description.replace(/\r?\n/g, '<br />');

        // Inserer le produit
        this._subs.create = this.productService.createProduct(this.product, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Produit crée avec succes' } : null;
            this.products();
          });
        break;

      case 'users':
        // Inserer l'utilisateur
        this._subs.create = this.userService.createUser(this.user).subscribe(data => {
          this.output = (data['notice']) ? { 'notice': 'Utilisateur crée avec succes' } : { 'error': 'Cet Email est déja utilisé' };
          this.users();
        });
        break;

      default:
        break;
    }
  }

  prepareForUpdate(modelId) {
    this.updateId = modelId;
  }

  cancel() {
    this.updateId = null;
  }

  update(model) {
    switch(this.state) {
      case 'categories':
        // Modifier la categorie
        this._subs.update = this.categoryService.updateCategory(model.id, this._token, model)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Catégorie modifiée avec succes' } : null;
            this.categories();

            // Actualiser le composant Header pour afficher les nouveaux noms
            HeaderComponent.categories.next(true);
          });

        break;

      case 'products':
        // Supprimer le nom de categorie dans notre produit
        delete model.category.title;

        // Ajouter des sauts de ligne
        model.description = model.description.replace(/\r?\n/g, '<br />');

        // Modifier le produit
        this._subs.update = this.productService.updateProduct(model.id, this._token, model)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Produit modifié avec succes' } : null;
            this.products();
          });
        break;

      case 'users':
        // Modifier l'utilisateur
        this._subs.update = this.userService.updateUser(model.id, this._token, model)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Utilisateur modifié avec succes' } : null;
            this.users();
          });
        break;

      default:
        break;
    }

    this.cancel();
  }

  delete(model) {
    switch(this.state) {
      case 'categories':
        // Supprimer la categorie
        this._subs.delete = this.categoryService.deleteCategory(model.id, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Catégorie supprimée avec succes' } : null;

            // Actualiser la page et le header pour enlever la categorie supprime
            this.categories();
            HeaderComponent.categories.next(true);
          });
        break;

      case 'products':
        // Supprimer le produit
        this._subs.delete = this.productService.deleteProduct(model.id, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Produit supprimée avec succes' } : null;
            this.products();
          });
        break;

      case 'users':
        // Supprimer l'utilisateur
        this._subs.delete = this.userService.deleteUser(model.id, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Utilisateur supprimé avec succes' } : null;
            this.users();
          });
        break;

      case 'comments':
        // Supprimer le commentaire
        this._subs.delete = this.commentService.deleteComment(model.id, this._token)
          .subscribe(data => {
            this.output = (data['notice']) ? { 'notice': 'Commentaire supprimé avec succes' } : null;
            this.comments();
          });
        break;

      default:
        break;
    }
  }

  ngOnDestroy() {
    for(let sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
