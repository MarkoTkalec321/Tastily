import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/Category";

const API_URL = 'http://localhost:8080/category';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class CategoriesService {

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.http.get(API_URL);
  }

  checkCategoryName(name: string): Observable<boolean> {
    const url = `${API_URL}/check-name/${name}`;
    return this.http.get<boolean>(url);
  }

  saveCategory(name: string, description: string): Observable<any> {
    return this.http.post(API_URL, {name, description}, httpOptions);
  }

  updateCategory(categoryData: Partial<Category>): Observable<Category> {
    const url = `${API_URL}/${categoryData.id}`;
    return this.http.put<Category>(url, categoryData, httpOptions);
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${API_URL}/${id}`;
    return this.http.delete(url, httpOptions);
  }
}
