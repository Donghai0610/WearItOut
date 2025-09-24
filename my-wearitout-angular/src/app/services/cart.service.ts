import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface CartItem {
  cartId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stockQuantity?: number;
  totalPrice?: number;
}

export interface Cart {
  cartId: number;
  userId: number;
  products: CartItem[];
  totalPrice: number;
  settingName: string;
  shopName: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadCartFromStorage();
  }

  addToCart(userId: number, productId: number, quantity: number = 1): Observable<ApiResponse<any>> {
    return this.apiService.addToCart(userId, productId, quantity);
  }

  getCart(userId: number): Observable<ApiResponse<Cart>> {
    return this.apiService.getCart(userId);
  }

  updateCartItem(userId: number, productId: number, quantity: number): Observable<ApiResponse<any>> {
    return this.apiService.updateCartItem(userId, productId, quantity);
  }

  removeFromCart(userId: number, productId: number): Observable<ApiResponse<any>> {
    return this.apiService.removeCartItem(userId, productId);
  }

  clearCart(userId: number): Observable<ApiResponse<any>> {
    return this.apiService.clearCart(userId);
  }

  updateLocalCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.updateCartCount();
    this.saveCartToStorage(items);
  }

  getLocalCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  private updateCartCount(): void {
    const items = this.cartItemsSubject.value;
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSubject.next(count);
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const cartData = localStorage.getItem('cartItems');
      if (cartData) {
        const items: CartItem[] = JSON.parse(cartData);
        this.cartItemsSubject.next(items);
        this.updateCartCount();
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }

  calculateTotalPrice(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  isProductInCart(productId: number): boolean {
    const items = this.cartItemsSubject.value;
    return items.some(item => item.productId === productId);
  }

  getCartItemByProductId(productId: number): CartItem | undefined {
    const items = this.cartItemsSubject.value;
    return items.find(item => item.productId === productId);
  }

  syncCartWithServer(userId: number): Observable<ApiResponse<Cart>> {
    return this.getCart(userId);
  }
}