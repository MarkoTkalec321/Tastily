import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {StorageService} from "./_services/storage.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(private router: Router, private storageService: StorageService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.storageService.isLoggedIn()

    if (isLoggedIn) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
