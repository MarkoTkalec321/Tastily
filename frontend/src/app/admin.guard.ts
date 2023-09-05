import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {StorageService} from "./_services/storage.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard{

  constructor(private storageService: StorageService, private router:Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentUser = this.storageService.getUser();

    if (currentUser && currentUser.authoritiesList.includes('ROLE_ADMIN')) {
      return true;

    }

    this.router.navigate(['/']);
    return false;
  }
}
