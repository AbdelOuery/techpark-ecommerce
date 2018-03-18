import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService }  from '../../services/category.service';
import { Product } from '../../models/product';
import { CartComponent } from './cart.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'category-component',
  templateUrl: './category.component.html'
})

export class CategoryComponent implements OnInit, OnDestroy {
  categoryName: string;
  products: Product[];
  private _subs: any = {};

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private categoryService: CategoryService,
              private productService: ProductService,
              private title: Title) { }

  ngOnInit() {
    this._subs.params = this.activatedRoute.params.subscribe((params: Params) => {

      // Recuperer le titre de categories
      this._subs.category = this.categoryService.getCategoryById(params['category_id'])
        .subscribe(data => {
          this.categoryName = data.title;
          this.title.setTitle(this.categoryName);
        });

      // Recuperer tous les produits du categories specifie dans l'url
      this._subs.products = this.productService.getProductsByCategory(params['category_id'])
        .subscribe(data => this.products = data);
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
