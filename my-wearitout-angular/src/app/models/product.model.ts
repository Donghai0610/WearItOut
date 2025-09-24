// Interface để map với DTO từ backend (updated theo JSON response thực tế)
export interface ProductDTO {
  id: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: string; 
  rating: number;
  imageUrls: string[]; 
  settingName: string; 
  shopName: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho response từ backend
export interface ProductPageResponse {
  content: ProductDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Interface cho search parameters
export interface ProductSearchParams {
  productName?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  setting?: string;
  shop?: string;
  page?: number;
  size?: number;
}

// Interface cho local product data (UI model)
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrls?: string[]; // Multiple images
  rating: number;
  description?: string;
  category?: string;
  shop?: string;
  stockQuantity?: number;
  status?: string;
}

// Mapper function để convert DTO thành UI model
export class ProductMapper {
  static fromDTO(dto: ProductDTO): Product {
    return {
      id: dto.id,
      name: dto.productName,
      price: dto.price,
      image: dto.imageUrls && dto.imageUrls.length > 0 
        ? dto.imageUrls[0] 
        : '/assets/images/placeholder-product.jpg',
      imageUrls: dto.imageUrls,
      rating: dto.rating || 0,
      description: dto.description,
      category: dto.settingName,
      shop: dto.shopName,
      stockQuantity: dto.stockQuantity,
      status: dto.status
    };
  }

  static fromDTOList(dtoList: ProductDTO[]): Product[] {
    return dtoList.map(dto => this.fromDTO(dto));
  }
}