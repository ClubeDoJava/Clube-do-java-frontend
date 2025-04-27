import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { faShoppingCart, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faBoxOpen, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbDropdownModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  cartItemCount$: Observable<number>;
  userName$: Observable<string | null>;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faBoxOpen = faBoxOpen;
  faHeart = faHeart;
  isNavbarCollapsed = true;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.currentUser.pipe(
      map(user => !!user)
    );
    this.userName$ = this.authService.currentUser.pipe(
      map(user => user ? user.name : null)
    );
    this.cartItemCount$ = this.cartService.itemCount$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.isNavbarCollapsed = true;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
    this.isNavbarCollapsed = true;
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
    this.isNavbarCollapsed = true;
  }

  navigateToProfile(): void {
    this.router.navigate(['/user/profile']);
    this.isNavbarCollapsed = true;
  }

  navigateToOrders(): void {
    this.router.navigate(['/user/orders']);
    this.isNavbarCollapsed = true;
  }
} 