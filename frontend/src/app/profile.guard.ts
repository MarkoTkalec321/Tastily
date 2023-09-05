import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs";
import {StorageService} from "./_services/storage.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard {

  constructor(private router: Router, private storageService: StorageService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.storageService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
