import {Component, OnInit} from '@angular/core';
import { CartService } from '../_services/cart.service';
import { Item } from '../model/Item';
import { OrderService } from "../_services/order.service";
import { OrderDetails } from "../model/Order";
import { StorageService } from "../_services/storage.service";
import {Router} from "@angular/router";
import {delay} from "rxjs";
import {CheckoutGuard} from "../checkout.guard";

export type CheckoutItem = {
  item: Item;
  details: OrderDetails;
};

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  displayItems: { item: Item, details: OrderDetails }[] = [];
  checkoutItems: CheckoutItem[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'price', 'quantity', 'subtotal', 'delete'];

  isLoading = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private router: Router,
    private checkoutGuard: CheckoutGuard
  ) { }

  ngOnInit() {
    this.cartService.getCartItems();
    this.cartService.getOrderDetails();

    console.log("Items:", this.cartService.items);
    console.log("Order Details:", this.cartService.orderDetails);

    this.displayItems = this.cartService.orderDetails
      .map(detail => {
        const item = this.cartService.items.find(item => item.id === detail.item_id);
        if (item) {
          detail.selected = true;
          return { item, details: detail };
        }
        return undefined;
      })
      .filter(Boolean) as { item: Item; details: OrderDetails; }[];
  }

  checkout() {

    const userId = this.getUserId();
    this.checkoutGuard.authorizeCheckout();
    if (!userId || userId === 0) {
      alert('Please log in to proceed with the checkout.');
      return;
    }
    this.isLoading = true;

    const cartItems: OrderDetails[] = this.displayItems
      .filter(item => item.details.selected)
      .map(item => item.details);

    const order = { user_id: userId, cartItems, status_id: 4};

    console.log('checkout order:', order);
    this.orderService.createOrder(order).pipe(delay(1000)).subscribe(order => {

      this.isLoading = false;

      const order_id = order.id;

      this.cartService.clearCartItems();

      //test
      this.cartService.clearOrderDetails()

      this.router.navigate(['/checkout', order_id], {
        state: { checkoutItems: cartItems.map(detail => {
            return {
              item: this.displayItems.find(displayItem => displayItem.details === detail)?.item,
              details: detail
            };
          }) }
      });



    }, error => {
      this.isLoading = false;
      alert('Error creating order.');
      console.error('Error creating order:', error);
    });
  }

  hasSelectedItems(): boolean {
    return this.displayItems.some(item => item.details.selected);
  }

  selectAll(event: Event) {
    const selected = (event.target as HTMLInputElement).checked;
    this.displayItems.forEach(item => item.details.selected = selected);
  }

  deleteSelectedItems() {
    this.displayItems = this.displayItems.filter(item => !item.details.selected);
    this.cartService.updateCartItemsAndOrderDetails(this.displayItems);
  }


  deleteItem(orderDetail: OrderDetails) {
    this.displayItems = this.displayItems.filter(item => item.details !== orderDetail);
    this.cartService.updateCartItemsAndOrderDetails(this.displayItems);
  }

  private getUserId(): number {
    console.log("USER ID: ", this.storageService.getUserId()?.toString());
    return this.storageService.getUserId() || 0;
  }

  incrementQuantity(itemDetail: OrderDetails): void {
    if (itemDetail.quantity < 99) {
      itemDetail.quantity += 1;
      this.cartService.updateOrderDetails(itemDetail);
    }
  }

  decrementQuantity(itemDetail: OrderDetails): void {
    if (itemDetail.quantity > 1) {
      itemDetail.quantity -= 1;
      this.cartService.updateOrderDetails(itemDetail);
    }
  }

  getSubtotal(): number {
    return this.displayItems
      .filter(item => item.details.selected)
      .reduce((total, displayItem) => {
        const itemPrice = displayItem.item.price * (1 - displayItem.item.discount / 100);
        return total + displayItem.details.quantity * itemPrice;
      }, 0);
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
