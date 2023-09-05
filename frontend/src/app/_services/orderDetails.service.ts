import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderDetails} from "../model/Order";
import {StorageService} from "./storage.service";

const API_URL = 'http://localhost:8080/order-details/';

@Injectable({
  providedIn: 'root'
})

export class OrderDetailsService {

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getOrderDetailsByOrderId(id: number | undefined): Observable<any> {
    const url = `${API_URL}order/${id}`;
    return this.http.get<OrderDetails[]>(url, this.storageService.getHttpOptions());
  }


}
