import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Item} from "../model/Item";
import { catchError } from 'rxjs/operators';


const API_URL2 = 'http://localhost:8080/item';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ItemsService {

  constructor(private http: HttpClient) {}

  getAllItems(){
    return this.http.get<Item[]>(API_URL2);
  }

  getItemsByCategory(category_id: number): Observable<any> {
    const url = `${API_URL2}/category/${category_id}`;
    return this.http.get<Item[]>(url);
  }

  getItemsByIds(ids: number[]): Observable<Item[]> {
    const idsParam = ids.join(',');

    const url = `${API_URL2}/value?ids=${idsParam}`;
    return this.http.get<Item[]>(url, httpOptions);
  }

  checkItemName(name: string): Observable<boolean> {
    const url = `${API_URL2}/check-name/${name}`;
    return this.http.get<boolean>(url);
  }

  saveItem(formData: FormData) {
    return this.http.post(API_URL2, formData)
      .pipe(
        catchError(error => {
          console.error("There was an error during the request:", error);
          throw error;
        })
      );
  }

  updateItem(itemData: Partial<Item>): Observable<Item> {
    const url = `${API_URL2}/${itemData.id}`;
    return this.http.put<Item>(url, itemData, httpOptions);
  }

  deleteItem(id:number): Observable<any> {
    const url = `${API_URL2}/${id}`;
    return this.http.delete(url, httpOptions);
  }

}
