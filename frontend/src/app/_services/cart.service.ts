import { Injectable } from '@angular/core';
import { Item } from '../model/Item';
import {OrderDetails} from "../model/Order";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  orderDetails: OrderDetails[] = [];
  items: Item[] = [];

  constructor(private snackBar: MatSnackBar, private storageService: StorageService) {

  }

  addToCart(item: Item, orderDetails: OrderDetails) {

    const existingOrderDetails = this.orderDetails.find(od => od.item_id === orderDetails.item_id);

    if (existingOrderDetails) {

      existingOrderDetails.quantity += orderDetails.quantity;
      this.snackBar.open('Item quantity has been updated in the cart.', 'Close', {
        duration: 3000
      });

    } else {

      this.orderDetails.push(orderDetails);
      this.items.push(item);
      this.snackBar.open('Item has been added to the cart.', 'Close', {
        duration: 3000
      });
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items));
    localStorage.setItem(this.ORDER_DETAILS_KEY, JSON.stringify(this.orderDetails));
  }

  getCartItems() {
    const storedItems = localStorage.getItem(this.CART_KEY);
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  getOrderDetails() {
    const storedOrderDetails = localStorage.getItem(this.ORDER_DETAILS_KEY);
    if (storedOrderDetails) {
      this.orderDetails = JSON.parse(storedOrderDetails);
    }
  }

  updateOrderDetails(updatedOrderDetail: OrderDetails) {

    const existingOrderDetail = this.orderDetails.find(od => od.item_id === updatedOrderDetail.item_id);

    if (existingOrderDetail) {
      existingOrderDetail.quantity = updatedOrderDetail.quantity;
      localStorage.setItem(this.ORDER_DETAILS_KEY, JSON.stringify(this.orderDetails));
    }
  }

  updateCartItemsAndOrderDetails(displayItems: { item: Item, details: OrderDetails }[]) {
    this.items = displayItems.map(di => di.item);
    this.orderDetails = displayItems.map(di => di.details);

    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items));
    localStorage.setItem(this.ORDER_DETAILS_KEY, JSON.stringify(this.orderDetails));
  }

  get CART_KEY() {
    const userId = this.storageService.getUserId() || 'guest';
    return `${userId}_cart_items`;
  }

  get ORDER_DETAILS_KEY() {
    const userId = this.storageService.getUserId() || 'guest';
    return `${userId}_order_details`;
  }

  clearCartItems() {
    this.items = [];
    localStorage.removeItem(this.CART_KEY);
  }

  clearOrderDetails() {
    this.orderDetails = [];
    localStorage.removeItem(this.ORDER_DETAILS_KEY);
  }
}
