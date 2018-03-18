import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CartComponent } from './cart.component';

@Component({
  selector: 'product-component',
  templateUrl: './product.component.html'
})

export class ProductComponent implements OnInit, OnDestroy {
  product: Product;
  user: User;
  token: string;
  comments: Comment[];
  comment: any = {};
  forUpdate: boolean = false;
  output: any;
  private _subs: any = {};

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private commentService: CommentService,
              private userService: UserService,
              private title: Title) { }

  fetchProduct(productId) {
    // Recuperer le produit
    this._subs.product = this.productService.getProductById(productId).subscribe(data => {
      this.product = data;

      // Changer le titre de la page
      this.title.setTitle(this.product.title);
    });
  }

  ngOnInit() {

    // Recuperer l'utilisateur et son jeton
    this.user = this.userService.getCurrentUser();
    this.token = this.userService.getToken();

    this._subs.params = this.activatedRoute.params.subscribe((params: Params) => {

      // Recuperer le produit specifie dans l'url
      this.fetchProduct(params['id']);
    });
  }

  onSubmit() {
    // References les identifiants d'utilisateur et de produit dans l'objet de commentaire
    this.comment.product = { id: this.product.id };
    this.comment.user = { id: this.user.id };

    // Inserer me nouveau commentaire
    this._subs.create = this.commentService.createComment(this.comment, this.token).subscribe(data => {
      if(data['notice']) {
        this.output = { notice: 'Votre commentaire à été bien ajouté' };

        // Actualiser le produit pour recuperer ces nouveaux commentaires
        this.fetchProduct(this.product.id);
      }
    });
  }

  prepareForUpdate() {
    this.forUpdate = true;
  }

  cancel() {
    this.forUpdate = false;
  }

  update(comment) {
    // Mettre a jour le commentaire
    this._subs.update = this.commentService.updateComment(comment.id, this.token, comment).subscribe(data => {
      if(data['notice']) {
        this.output = { notice: 'Commentaire modifié' };

        // Actualiser le produit
        this.fetchProduct(this.product.id);
      }
    });
    this.cancel();
  }

  delete(commentId) {
    // Supprimer le commentaire
    this._subs.delete = this.commentService.deleteComment(commentId, this.token).subscribe(data => {
      if(data['notice']) {
        this.output = { notice: 'Commentaire supprimé' };

        // Actualiser le produit
        this.fetchProduct(this.product.id);
      }
    });
  }

  addToCart(product) {
    CartComponent.addToCart(product);
  }

  ngOnDestroy() {
    for(let sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
