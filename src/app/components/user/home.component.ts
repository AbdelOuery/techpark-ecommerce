import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartComponent } from './cart.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
  products: Product[];
  output: any;
  private _sub;

  constructor(private productService: ProductService,
              private title: Title,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Changer le titre de page
    this.title.setTitle('Bienvenue dans le TechPark');

    // Recuperer les 9 derniers produits
    this._sub = this.productService.getLatestProducts()
                .subscribe(data => this.products = data);

    if(this.activatedRoute.snapshot.queryParams['message'] === 'purchase-success') {
      this.output = { 'notice': 'Merci! Vos achats ont été éffecuté avec succes' };
    }
  }

  addToCart(product) {
    CartComponent.addToCart(product);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
