import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { HeaderComponent } from '../template/header.component';
declare const $: any;

@Component({
  selector: 'cart-component',
  templateUrl: './cart.component.html'
})

export class CartComponent implements OnInit, OnDestroy {
  static products: Product[];
  products: Product[];

  constructor(private router: Router) { }

  ngOnInit() {
    // Click listener pour afficher/masquer le panier
    $('#cart .toggler').on('click', function() {
      $(this).parent().children().toggle();
      $(this).parent().parent().find('.cart-content').slideToggle();
    });

    CartComponent.products = [];
    this.products = CartComponent.products;
  }

  static getProducts() {
    return CartComponent.products;
  }

  static addToCart(product) {
    // Ajouter un produit dans le panier
    CartComponent.products.push(product);
    this.products = CartComponent.products;
  }

  static removeFromCart(product) {
    // Enlever un produit du panier
    const index = CartComponent.products.indexOf(product);
    if(index != -1) {
      CartComponent.products.splice(index, 1);
    }
    this.products = CartComponent.products;
  }

  removeFromCart(product) {
    const index = CartComponent.products.indexOf(product);
    if(index != -1) {
      CartComponent.products.splice(index, 1);
    }
    this.products = CartComponent.products;
  }

  cancel() {
    // Vider le panier
    CartComponent.products = [];
    this.products = CartComponent.products;
  }

  checkout() {
    // Renvoyer vers la page de paiement
    this.router.navigate(['paiement']);
  }

  ngOnDestroy() {
    this.cancel();
  }
}
