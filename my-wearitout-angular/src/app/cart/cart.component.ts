import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService, CartItem, Cart } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../services/api.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  error: string | null = null;
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService
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
        const errorMessage = error.userMessage || 'Không thể tải giỏ hàng';
        this.error = errorMessage;
        this.toastr.error(errorMessage, '❌ Lỗi tải giỏ hàng', {
          timeOut: 4000,
          progressBar: true
        });
        this.isLoading = false;
      }
    });
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    // Business rule validation with user education
    const item = this.cartItems.find(item => item.productId === productId);
    if (item && item.stockQuantity !== undefined && newQuantity > item.stockQuantity) {
      this.toastr.info(
        `Bạn đang chọn ${newQuantity} sản phẩm nhưng kho chỉ còn ${item.stockQuantity}. Đơn hàng vẫn có thể đặt và sẽ được xử lý theo thứ tự.`, 
        'ℹ️ Thông tin tồn kho',
        { timeOut: 5000, progressBar: true }
      );
      // Continue with the update - business allows this
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
          this.toastr.success('Số lượng đã được cập nhật!', '✅ Thành công', {
            timeOut: 2000,
            progressBar: true
          });
        }
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        const errorMessage = error.userMessage || 'Không thể cập nhật số lượng';
        this.error = errorMessage;
        this.toastr.error(errorMessage, '❌ Lỗi cập nhật', {
          timeOut: 4000,
          progressBar: true
        });
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
          this.toastr.success('Sản phẩm đã được xóa khỏi giỏ hàng!', '🗑️ Đã xóa', {
            timeOut: 2000,
            progressBar: true
          });
        }
      },
      error: (error) => {
        const errorMessage = error.userMessage || 'Không thể xóa sản phẩm';
        this.error = errorMessage;
        this.toastr.error(errorMessage, '❌ Lỗi xóa', {
          timeOut: 4000,
          progressBar: true
        });
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
          this.toastr.success('Tất cả sản phẩm đã được xóa khỏi giỏ hàng!', '🗑️ Đã xóa hết', {
            timeOut: 3000,
            progressBar: true
          });
        }
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        const errorMessage = error.userMessage || 'Không thể xóa giỏ hàng';
        this.error = errorMessage;
        this.toastr.error(errorMessage, '❌ Lỗi xóa giỏ hàng', {
          timeOut: 4000,
          progressBar: true
        });
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
      // Business rule: Allow adding more than stock, but warn user
      if (item.stockQuantity !== undefined && item.quantity >= item.stockQuantity) {
        this.toastr.warning(
          `Bạn đã chọn ${item.quantity}/${item.stockQuantity} sản phẩm. Khi đặt hàng, đơn hàng sẽ được xử lý theo thứ tự có hàng.`, 
          '⚠️ Vượt quá tồn kho',
          { timeOut: 5000, progressBar: true }
        );
        // Don't return - allow adding more for business logic
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
    
    // Show actual stock from DB with context
    if (item.stockQuantity <= 0) {
      return 'Hết hàng';
    } else if (item.stockQuantity <= 5) {
      return `Kho: ${item.stockQuantity} sản phẩm`;
    }
    return `Kho: ${item.stockQuantity} sản phẩm`;
  }

  getStockStatusClass(item: CartItem): string {
    if (!item.stockQuantity) return '';
    
    // Use actual stock quantity from DB, not remaining after cart
    if (item.stockQuantity <= 0) {
      return 'stock-out';
    } else if (item.stockQuantity <= 5) {
      return 'stock-low';
    }
    return 'stock-normal';
  }

  isStockAvailable(item: CartItem): boolean {
    if (!item.stockQuantity) return true;
    // For business logic: Always allow adding (no hard limit)
    // But we'll show warnings when exceeding actual stock
    return true;
  }

  hasStockWarning(item: CartItem): boolean {
    if (!item.stockQuantity) return false;
    return item.quantity > item.stockQuantity;
  }

  getMaxQuantity(item: CartItem): number {
    return item.stockQuantity || 999;
  }

  // Get remaining quantity that can be added to cart (for validation)
  getRemainingAddable(item: CartItem): number {
    if (!item.stockQuantity) return 999;
    return Math.max(0, item.stockQuantity - item.quantity);
  }

  // Detailed stock info with business logic explanation
  getDetailedStockInfo(item: CartItem): string {
    if (!item.stockQuantity) return 'Không giới hạn';
    const remaining = this.getRemainingAddable(item);
    return `Tồn kho: ${item.stockQuantity} | Trong giỏ hiện tại: ${item.quantity} | Có thể thêm: ${remaining}`;
  }

  // Business logic display for user understanding
  getStockBusinessInfo(item: CartItem): string {
    if (!item.stockQuantity) return '';
    
    if (item.quantity >= item.stockQuantity) {
      return '⚠️ Bạn đã chọn hết số lượng có sẵn. Khi đặt hàng, đơn hàng sẽ được xử lý theo thứ tự.';
    }
    
    const remaining = this.getRemainingAddable(item);
    if (remaining <= 2) {
      return `⚠️ Chỉ có thể thêm ${remaining} sản phẩm nữa vào giỏ hàng.`;
    }
    
    return `✅ Có thể thêm tối đa ${remaining} sản phẩm nữa.`;
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

}
