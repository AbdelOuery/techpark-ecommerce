import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { CartComponent } from './cart.component';
import { PurchaseService } from '../../services/purchase.service';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { Purchase } from '../../models/purchase';
import { Router } from '@angular/router';

@Component({
  selector: 'paiement-component',
  templateUrl: './paiement.component.html'
})

export class PaiementComponent implements OnInit, OnDestroy {
  user: any;
  products: Product[];
  total: number;
  private _sub;

  constructor(private userService: UserService,
              private purchaseService: PurchaseService,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Paiement');

    // Recuperer les produits du panier et calculer le totale
    this.products = CartComponent.getProducts();
    this.total = this.products.reduce((sum, current) => sum + current.price, 0);

    if(!this.products.length) {
      this.router.navigate(['']);
    }
  }

  removeFromCart(product) {
    CartComponent.removeFromCart(product);
    this.products = CartComponent.getProducts();
    this.total = this.products.reduce((sum, current) => sum + current[1], 0);
  }

  validatePurchases() {

    // Recuperer l'utilisateur et son jeton
    const user = this.userService.getCurrentUser();
    const token = this.userService.getToken();

    for(let product of this.products) {

      // Creer un achat et referencer le produit et l'utilisateur
      const purchase = new Purchase();
      purchase.product = { id: product.id };
      purchase.user = { id: user.id };

      // Effectuer les achats
      this._sub = this.purchaseService.createPurchase(purchase, token)
        .subscribe(data => {
          this.router.navigate([''], { queryParams: { message: 'purchase-success' }});
        });
    }
  }

  ngOnDestroy() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
  }
}
