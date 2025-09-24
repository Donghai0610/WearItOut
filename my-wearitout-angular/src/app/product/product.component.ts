import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiResponse } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule,Header, Footer],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: ProductDTO[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Search filters
  searchForm = {
    productName: '',
    priceMin: null as number | null,
    priceMax: null as number | null,
    ratingMin: null as number | null,
    ratingMax: null as number | null,
    setting: '',
    shop: '',
    page: 0,
    size: 9,
    sortDirection: 'asc'
  };
  
  // Pagination info
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (!this.isBrowser) return;
    
    this.isLoading = true;
    this.error = null;

    // Build query parameters
    const params: any = {};
    
    if (this.searchForm.productName) {
      params.productName = this.searchForm.productName;
    }
    if (this.searchForm.priceMin !== null) {
      params.priceMin = this.searchForm.priceMin;
    }
    if (this.searchForm.priceMax !== null) {
      params.priceMax = this.searchForm.priceMax;
    }
    if (this.searchForm.ratingMin !== null) {
      params.ratingMin = this.searchForm.ratingMin;
    }
    if (this.searchForm.ratingMax !== null) {
      params.ratingMax = this.searchForm.ratingMax;
    }
    if (this.searchForm.setting) {
      params.setting = this.searchForm.setting;
    }
    if (this.searchForm.shop) {
      params.shop = this.searchForm.shop;
    }
    
    params.page = this.searchForm.page;
    params.size = this.searchForm.size;
    params.sortDirection = this.searchForm.sortDirection;

    

    this.apiService.getProducts(params)
      .subscribe({
        next: (response: ApiResponse) => {
          
          if (response.code === 200 && response.result) {
            this.products = response.result.content.map(this.mapToProductDTO);
            this.totalElements = response.result.page.totalElements;
            this.totalPages = response.result.page.totalPages;
            this.currentPage = response.result.page.number;
          }
          
          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = error.userMessage || 'Không thể tải danh sách sản phẩm. Vui lòng thử lại!';
          this.isLoading = false;
        }
      });
  }

  private mapToProductDTO(item: any): ProductDTO {
    return {
      id: item.id,
      name: item.productName,
      price: item.price,
      image: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '',
      imageUrls: item.imageUrls || [],
      rating: item.rating || 0,
      description: item.description,
      category: item.settingName,
      shop: item.shopName,
      stockQuantity: item.stockQuantity,
      status: item.status
    };
  }

  onSearch(): void {
    this.searchForm.page = 0; // Reset to first page
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.searchForm.page = page;
    this.loadProducts();
  }

  onSortChange(direction: string): void {
    this.searchForm.sortDirection = direction;
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchForm = {
      productName: '',
      priceMin: null,
      priceMax: null,
      ratingMin: null,
      ratingMax: null,
      setting: '',
      shop: '',
      page: 0,
      size: 9,
      sortDirection: 'asc'
    };
    this.loadProducts();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id;
  }

  addToCart(product: ProductDTO, quantity: number = 1): void {
    console.log('🛒 Starting addToCart for product:', product.id);
    
    
    if (!this.authService.isLoggedIn()) {
      console.error('❌ User not logged in');
      this.error = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
      return;
    }

    // Check stock quantity
    if (product.stockQuantity && quantity > product.stockQuantity) {
      console.error('❌ Not enough stock:', product.stockQuantity);
      this.error = `Chỉ còn ${product.stockQuantity} sản phẩm trong kho`;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    console.log('🔑 Current user:', currentUser);
    
    // Try to get userId, if none available, we might need to use username
    let userId = currentUser?.id;
    
    if (!userId && this.isBrowser) {
      // Fallback: try to extract user info from localStorage
      const username = localStorage.getItem('username');
      console.log('🔧 No userId found, trying username approach:', username);
      
      if (!username) {
        console.error('❌ Cannot get user identification');
        this.error = 'Không thể xác định người dùng. Vui lòng đăng nhập lại.';
        return;
      }
      
      // For now, we'll use username in API path or you need to modify API
      // This might need backend API change to accept username instead of userId
      userId = username as any; // Temporary solution
    }

    if (!userId) {
      console.error('❌ No user identification available');
      this.error = 'Không thể xác định người dùng. Vui lòng đăng nhập lại.';
      return;
    }

    console.log('🛒 Adding to cart - UserId:', userId, 'ProductId:', product.id, 'Quantity:', quantity);
    
    // Check token exists
    const token = this.isBrowser ? localStorage.getItem('authToken') : null;
    console.log('🔑 Token status:', token ? 'exists' : 'missing');
    console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'none');
    
    // Show loading state
    const addingToCartMessage = `Đang thêm ${product.name} vào giỏ hàng...`;
    

    // Call API to add to cart
    this.cartService.addToCart(userId as number, product.id, quantity).subscribe({
      next: (response) => {
        if (response.code === 200) {
          console.log('✅ Added to cart successfully:', response);
          
          // Update local cart for UI
          const cartItem = {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: product.image,
            stockQuantity: product.stockQuantity,
            totalPrice: product.price * quantity
          };

          // Update local cart state
          const currentItems = this.cartService.getLocalCartItems();
          const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);
          
          if (existingItemIndex >= 0) {
            // Update existing item
            currentItems[existingItemIndex].quantity += quantity;
            currentItems[existingItemIndex].totalPrice = currentItems[existingItemIndex].price * currentItems[existingItemIndex].quantity;
          } else {
            // Add new item
            currentItems.push(cartItem);
          }
          
          this.cartService.updateLocalCart(currentItems);
          
          // Show success message
          this.showSuccessMessage(`Đã thêm ${product.name} vào giỏ hàng!`);
        }
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          userMessage: error.userMessage
        });
        this.error = error.userMessage || `Lỗi ${error.status}: ${error.statusText}` || 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!';
      }
    });
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast/snackbar service here
    console.log('Success:', message);
    // For now, just clear any existing error
    this.error = null;
    
    // You could also show a temporary success message
    const originalError = this.error;
    this.error = `✅ ${message}`;
    setTimeout(() => {
      this.error = originalError;
    }, 3000);
  }

  isProductInCart(productId: number): boolean {
    return this.cartService.isProductInCart(productId);
  }

  getCartItemQuantity(productId: number): number {
    const cartItem = this.cartService.getCartItemByProductId(productId);
    return cartItem ? cartItem.quantity : 0;
  }
}

// Interfaces
export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrls?: string[];
  rating: number;
  description?: string;
  category?: string;
  shop?: string;
  stockQuantity?: number;
  status?: string;
}