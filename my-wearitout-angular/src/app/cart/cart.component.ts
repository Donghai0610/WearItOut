import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem, Cart } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../services/api.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  loadCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Vui lòng đăng nhập để xem giỏ hàng';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cartService.getCart(currentUser.id).subscribe({
      next: (response: ApiResponse<Cart>) => {
        if (response.code === 200 && response.result) {
          this.cartItems = response.result.products;
          this.cartService.updateLocalCart(this.cartItems);
          
          // If any item doesn't have stockQuantity, fetch it from product API
          this.updateStockQuantities();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.error = error.userMessage || 'Không thể tải giỏ hàng';
        this.isLoading = false;
      }
    });
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    // Check stock availability
    const item = this.cartItems.find(item => item.productId === productId);
    if (item && item.stockQuantity !== undefined && newQuantity > item.stockQuantity) {
      this.error = `Chỉ còn ${item.stockQuantity} sản phẩm trong kho!`;
      this.successMessage = null;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.cartService.updateCartItem(currentUser.id, productId, newQuantity).subscribe({
      next: (response) => {
        if (response.code === 200) {
          // Update local cart
          const itemIndex = this.cartItems.findIndex(item => item.productId === productId);
          if (itemIndex >= 0) {
            this.cartItems[itemIndex].quantity = newQuantity;
            this.cartItems[itemIndex].totalPrice = this.cartItems[itemIndex].price * newQuantity;
            this.cartService.updateLocalCart(this.cartItems);
          }
          // Clear error and show success if successful
          this.error = null;
          this.showSuccessMessage('Đã cập nhật số lượng thành công!');
        }
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        this.error = error.userMessage || 'Không thể cập nhật số lượng';
      }
    });
  }

  removeItem(productId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.cartService.removeFromCart(currentUser.id, productId).subscribe({
      next: (response) => {
        if (response.code === 200) {
          // Update local cart
          this.cartItems = this.cartItems.filter(item => item.productId !== productId);
          this.cartService.updateLocalCart(this.cartItems);
          this.showSuccessMessage('Đã xóa sản phẩm khỏi giỏ hàng!');
        }
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
        this.error = error.userMessage || 'Không thể xóa sản phẩm';
      }
    });
  }

  clearCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;

    this.cartService.clearCart(currentUser.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.cartItems = [];
          this.cartService.updateLocalCart(this.cartItems);
        }
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.error = error.userMessage || 'Không thể xóa giỏ hàng';
      }
    });
  }

  private calculateTotalPrice(): void {
    this.totalPrice = this.cartService.calculateTotalPrice(this.cartItems);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      // Check if we can increase quantity
      if (item.stockQuantity !== undefined && item.quantity >= item.stockQuantity) {
        this.error = `Không thể thêm! Chỉ còn ${item.stockQuantity} sản phẩm trong kho.`;
        this.successMessage = null;
        return;
      }
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.productId;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  onQuantityChange(productId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);
    
    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.updateQuantity(productId, newQuantity);
    } else {
      // Reset to current quantity if invalid input
      const item = this.cartItems.find(item => item.productId === productId);
      if (item) {
        target.value = item.quantity.toString();
      }
    }
  }

  // Helper methods for stock management
  getStockStatus(item: CartItem): string {
    if (!item.stockQuantity) return '';
    
    const remaining = item.stockQuantity - item.quantity;
    if (remaining <= 0) {
      return 'Hết hàng';
    } else if (remaining <= 5) {
      return `Còn ${remaining} sản phẩm`;
    }
    return `Còn ${remaining} sản phẩm`;
  }

  getStockStatusClass(item: CartItem): string {
    if (!item.stockQuantity) return '';
    
    const remaining = item.stockQuantity - item.quantity;
    if (remaining <= 0) {
      return 'stock-out';
    } else if (remaining <= 5) {
      return 'stock-low';
    }
    return 'stock-normal';
  }

  isStockAvailable(item: CartItem): boolean {
    if (!item.stockQuantity) return true;
    return item.quantity < item.stockQuantity;
  }

  getMaxQuantity(item: CartItem): number {
    return item.stockQuantity || 999;
  }

  private getLocalStockQuantity(productId: number): number | undefined {
    // Try to get stock quantity from local cart items
    const localItems = this.cartService.getLocalCartItems();
    const localItem = localItems.find(item => item.productId === productId);
    return localItem?.stockQuantity;
  }

  private updateStockQuantities(): void {
    // For now, we'll use the stock quantity from local storage or default
    // In a real implementation, you might want to fetch individual product details
    this.cartItems.forEach(item => {
      if (!item.stockQuantity) {
        item.stockQuantity = this.getLocalStockQuantity(item.productId) || 10; // Default fallback
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.error = null;
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }
}
