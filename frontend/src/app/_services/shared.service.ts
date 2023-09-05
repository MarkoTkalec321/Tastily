import {Injectable} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import { FlatOrder } from "../model/FlatOrder";
import {BehaviorSubject, forkJoin, Observable, Subject} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {Order, OrderDetails} from "../model/Order";
import {Item} from "../model/Item";
import {StorageService} from "./storage.service";
import {OrderService} from "./order.service";
import {ItemsService} from "./items.service";
import {OrderDetailsService} from "./orderDetails.service";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _dataSourceSubject = new BehaviorSubject<MatTableDataSource<FlatOrder>>(new MatTableDataSource<FlatOrder>());
  private _fetchDataSubject = new Subject<void>();

  currentUser: any;
  orders: Order[] = [];
  flatOrders: any[] = [];

  dataSource$ = this._dataSourceSubject.asObservable();
  fetchDataTrigger$ = this._fetchDataSubject.asObservable();
  constructor(
    private storageService: StorageService,
    private orderService: OrderService,
    private itemsService: ItemsService,
    private orderDetailsService: OrderDetailsService) { }

  fetchDataAndPrepare(): void {
    this.fetchCurrentUser();
  }
  private fetchCurrentUser(): void {
      this.currentUser = this.storageService.getUser();
      if (this.currentUser && this.currentUser.id) {
      this.fetchOrdersByUserId(this.currentUser.id);
    }
  }

  private fetchOrdersByUserId(userId: number): void {
      this.orderService.getOrdersByUserId(userId)
        .pipe(
          tap(orders => {
            this.orders = orders;
            console.log('Orders:', orders);
          }),
          switchMap(orders => this.fetchOrderDetails(orders)),
          switchMap(({ orders, itemIds }) => this.fetchItems(orders, itemIds)),
          tap(({ orders, items }) => this.constructFlatOrders(orders, items))
        )
        .subscribe(
          () => {},
          error => console.error('An error occurred:', error)
        );
    }

  private fetchOrderDetails(orders: Order[]): Observable<{ orders: Order[], itemIds: number[] }> {
      return forkJoin(orders.map(order => this.orderDetailsService.getOrderDetailsByOrderId(order.id)))
        .pipe(
          map((detailsArray: OrderDetails[][]) => {
            const itemIds: number[] = [];
            orders.forEach((order, index) => {
              order.cartItems = detailsArray[index];
              order.cartItems.forEach(detail => itemIds.push(detail.item_id));
            });
            return { orders, itemIds };
          })
        );
    }

  private fetchItems(orders: Order[], itemIds: number[]): Observable<{ orders: Order[], items: Item[] }> {
      return this.itemsService.getItemsByIds(itemIds)
        .pipe(
          tap(items => {
            console.log('Received items:', items);
          }),
          map(items => ({ orders, items }))
        );
    }

  private constructFlatOrders(orders: Order[], items: Item[]): void {
      this.flatOrders = [];
      for (let order of orders) {
      if (Array.isArray(order.cartItems)) {
        for (let orderDetail of order.cartItems) {
          const matchedItem = items.find(item => item.id === orderDetail.item_id);
          if (matchedItem) {
            this.flatOrders.push({
              orderId: order.id,
              image: matchedItem.image,
              name: matchedItem.name,
              price: matchedItem.price,
              quantity: orderDetail.quantity,
              status: order.status_value
            });
          }
        }
      }
    }
    console.log('Constructed flatOrders for user:', this.flatOrders);
    this.updateDataSource();
  }

  private updateDataSource(): void {
    const updatedDataSource = new MatTableDataSource<FlatOrder>(this.flatOrders);
    this._dataSourceSubject.next(updatedDataSource);

  }

  fetchData(): void {
    this._fetchDataSubject.next();
  }

}


