import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {StorageService} from "../_services/storage.service";
import {CategoriesService} from "../_services/categories.service";
import {ItemsService} from "../_services/items.service";
import {Item} from "../model/Item";
import {Category} from "../model/Category";
import {CartService} from "../_services/cart.service";
import {OrderDetails} from "../model/Order";
import {ModalService} from "../_services/modal.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HomeComponent implements OnInit{
  categories: Category[] = [];
  items: Item[] = [];
  selectedCategoryId: number | null = null;
  public selectedCategoryName: string | null = null;
  noItems = false;
  selectedItem: any = null;

  constructor(private categoriesService: CategoriesService,
              private itemsService: ItemsService,
              private storageService: StorageService,
              private cartService: CartService,
              private modalService: ModalService) { }

  showModal(item: any) {
    this.selectedItem = item;
    this.modalService.show();
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = [{id: -1, name: 'All Products', description: 'All products'}, ...data];

        console.log('First category:', this.categories[0]);

        if (this.categories.length > 0) {

          this.getItemsFromCategory(this.categories[0].id);
        }
      },
      error: err => {
        console.log('Error:', err);
      }
    });
  }

  public getItemsFromCategory(category_id: number): void {
    console.log('category_id:', category_id);

    this.selectedCategoryId = category_id;
    this.items = [];
    this.noItems = true;

    const selectedCategory = this.categories.find(category => category.id === category_id);
    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
    }

    if (category_id === -1) {
      this.itemsService.getAllItems().subscribe({
        next: (items: Item[]) => {
          if (items && items.length > 0) {
            this.items = items;
            this.noItems = false;
          }
        },
        error: err => {
          console.log('Error:', err);
        }
      });
    }
    else {
      this.itemsService.getItemsByCategory(category_id).subscribe({
        next: (items: Item[]) => {
          if (items && items.length > 0) {
            this.items = items;
            this.noItems = false;
          }
        },
        error: err => {
          console.log('Error:', err);
        }
      });
    }
  }

  addToCart(item: Item) {

    const orderDetails: OrderDetails = {
      quantity: 1,
      item_id: item.id
    };

    this.cartService.addToCart(item, orderDetails);
  }
}
