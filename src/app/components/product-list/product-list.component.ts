import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // New Properties for paginaion
  thePagenumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyWord: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyWord != theKeyWord) {
      this.thePagenumber = 1;
    }

    this.previousKeyWord = theKeyWord;

    // this.productService.searchProducts(theKeyWord).subscribe((data) => {
    //   this.products = data;
    // });
    this.productService
      .searchProductListPaginate(
        this.thePagenumber - 1,
        this.thePageSize,
        theKeyWord
      )
      .subscribe(this.processResults());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePagenumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}, thePageNumber${this.thePagenumber} , thePageSize:${this.thePageSize}`
    );

    this.productService
      .getProductListPaginate(
        this.thePagenumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe((data) => {
        this.products = data._embedded.products;
        this.thePagenumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      });
  }

  updatePageSize(userSelectedPageSize: string) {
    this.thePageSize = +userSelectedPageSize;
    this.thePagenumber = 1;
    this.listProducts();
  }

  processResults() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageSize = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to the cart : ${theProduct.name} , price : ${theProduct.unitPrice}` );
  }
}
