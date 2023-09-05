import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SharedService} from "./shared.service";
import {FlatOrder} from "../model/FlatOrder";

@Injectable({
  providedIn: 'root',
})
export class ProfileDataResolver implements Resolve<FlatOrder[]> {
  constructor(private sharedService: SharedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FlatOrder[]> {
    this.sharedService.fetchData();
    return of([]);
  }
}


