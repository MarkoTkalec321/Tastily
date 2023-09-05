import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {OrderDetails, Order} from "../model/Order";
import {StorageService} from "./storage.service";

const API_URL = 'http://localhost:8080/order/';
const API_URL2 = 'http://localhost:8080/order';
const API_URL3 = 'http://localhost:8080/order-status';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  createOrder(order: { user_id: number; cartItems: OrderDetails[]; status_id: number }): Observable<any> {
    return this.http.post(API_URL, order, httpOptions);
  }

  getOrdersByUserId(user_id: number): Observable<any> {
    const url = `${API_URL}user/${user_id}`;
    return this.http.get<Order[]>(url, this.storageService.getHttpOptions());
  }

  getAllOrders(): Observable<any> {
    return this.http.get<Order[]>(API_URL2);
  }

  updateOrderWithOrderStatus(orderData: Partial<Order>): Observable<Order> {
    console.log('Order service Order Data:', orderData);
    const url = `${API_URL2}/${orderData.id}`;
    return this.http.put<Order>(url, orderData, httpOptions);
  }

  deleteCategory(id:number): Observable<any> {
    const url = `${API_URL2}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  getAllOrderStatuses(): Observable<any> {
    return this.http.get(API_URL3);
  }

}
