import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider';
import Product_Services from '../services/product';
import Shop_Services from '../services/shop';
import Cart_Services from '../services/cart';
import Account_Service from '../services/account';
import Swal from 'sweetalert2';
import formatVND from '../helper/formatVND';

const ShopSection = () => {
    const [shops, setShops] = useState([]);
    const [grid, setGrid] = useState(false);
    const [active, setActive] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState({
        productName: '',
        priceMin: '',
        priceMax: '',
        ratingMin: '',
        ratingMax: '',
        setting: '',
        shop: '',
        page: 0,
        size: 16,
        sortDirection: 'asc',
    });

    const [quantity, setQuantity] = useState(1);  // Quantity for the cart
    const [error, setError] = useState(null);

    const sidebarController = () => {
        setActive(!active);
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await Product_Services.Product_Category(6);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch shops
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await Shop_Services.Get_All_Shop();
                setShops(data);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };
        fetchShops();
    }, []);

    // Fetch products based on filters
    const fetchProducts = async (filters) => {
        try {
            const response = await Product_Services.Product_Search(filters);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Call API when filters change
    useEffect(() => {
        fetchProducts(filters);
    }, [filters]);

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setFilters({ ...filters, page });
    };

    // Update filter values
    const handleFilterChange = (keyMin, valueMin, keyMax, valueMax) => {
        setFilters((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [keyMin]: valueMin,
                [keyMax]: valueMax,
                page: 0,
            };
            return updatedFilters;
        });
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            productName: '',
            priceMin: 1,
            priceMax: 50000000,
            ratingMin: 0,
            ratingMax: 0,
            setting: '',
            shop: '',
            page: 0,
            size: 16,
            sortDirection: 'asc',
        });
    };

    // Add product to cart
    const handleAddToCart = async (product) => {
        const userId = Account_Service.getUserIdFromToken();

        if (!userId) {
            setError("User not authenticated");
            return;
        }

        try {
            const payload = {
                productId: product.id,
                quantity: quantity
            };

            await Cart_Services.Add_Product_To_Cart(userId, payload);
            Swal.fire({
                icon: 'success',
                title: 'Đã thêm sản phẩm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error('Error adding product to cart:', err);
            setError('Không thể thêm sản phẩm vào giỏ hàng');
            Swal.fire({
                icon: 'error',
                title: 'Không thể thêm sản phẩm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <section className="shop py-80">
            <div className={`side-overlay ${active && 'show'}`}></div>
            <div className="container container-lg">
                <div className="row">
                    {/* Sidebar Start */}
                    <div className="col-lg-3">
                        <div className={`shop-sidebar ${active && 'active'}`}>
                            <button
                                onClick={sidebarController}
                                type="button"
                                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
                            >
                                <i className="ph ph-x" />
                            </button>

                            {/* Categories */}
                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Danh Mục Sản Phẩm</h6>
                                <ul className="max-h-540 overflow-y-auto scroll-sm">
                                    {categories.map((category) => (
                                        <li className="mb-24" key={category.settingId}>
                                            <button
                                                type="button"
                                                className="text-gray-900 hover-text-main-600"
                                                onClick={() => handleFilterChange('setting', category.settingName)}
                                            >
                                                {category.settingName} ({category.count})
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Filter */}
                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Sắp Xếp Theo Giá</h6>
                                <div className="custom--range">
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        value={[filters.priceMin || 100000, filters.priceMax || 50000000]}
                                        onChange={(value) => handleFilterChange('priceMin', value[0], 'priceMax', value[1])}
                                        ariaLabel={['Lower thumb', 'Upper thumb']}
                                        pearling
                                        min={1}
                                        max={50000000}
                                    />
                                    <br />
                                    <br />
                                    <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                                        <button
                                            type="button"
                                            className="btn btn-main h-40 flex-align"
                                            onClick={() => fetchProducts(filters)}
                                        >
                                            Giá Từ :{filters.priceMin && filters.priceMax && (
                                                <span>
                                                    {formatVND(filters.priceMin)} VND - {formatVND(filters.priceMax)} VND
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Sắp Xếp Theo Đánh Giá</h6>
                                <div className="custom--range">
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        value={[filters.ratingMin || 0, filters.ratingMax || 5]}
                                        onChange={(value) => handleFilterChange('ratingMin', value[0], 'ratingMax', value[1])}
                                        ariaLabel={['Lower thumb', 'Upper thumb']}
                                        pearling
                                        min={1}
                                        max={5}
                                    />
                                    <br />
                                    <br />
                                    <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                                        <button
                                            type="button"
                                            className="btn btn-main h-40 flex-align"
                                            onClick={() => fetchProducts(filters)}
                                        >
                                            Đánh giá từ : {filters.ratingMin && filters.ratingMax && (
                                                <span>
                                                    {filters.ratingMin} sao - {filters.ratingMax} sao
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shops Filter */}
                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Sắp Xếp Theo Cửa Hàng</h6>
                                <ul className="max-h-540 overflow-y-auto scroll-sm">
                                    {shops.map((shop) => (
                                        <li className="mb-24" key={shop.shopId}>
                                            <div className="form-check common-check common-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="brand"
                                                    id={`brand-${shop.shopId}`}
                                                    onChange={() => handleFilterChange('shop', shop.shopName)}
                                                />
                                                <label className="form-check-label" htmlFor={`brand-${shop.shopId}`}>
                                                    {shop.shopName}
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Reset Filters Button */}
                            <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                                <button
                                    type="button"
                                    className="btn btn-secondary h-40 flex-align"
                                    onClick={resetFilters}
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar End */}

                    {/* Content Start */}
                    <div className="col-lg-9">
                        <div className="flex-between gap-16 flex-wrap mb-40 ">
                            <span className="text-gray-900">Showing {currentPage * 9 + 1}-{Math.min((currentPage + 1) * 9, products.length)} of {products.length} result</span>
                        </div>

                        {/* Product Listing */}
                        <div className={`list-grid-wrapper ${grid && 'list-view'}`}>
                            {products.map((product) => (
                                <div key={product.id} className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link to={`/product-details/${product.id}`} className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                                        <img
                                            src={product.imageUrls[0] || 'default-image-url.png'}
                                            alt={product.productName}
                                            style={{
                                                objectFit: 'cover',   // Đảm bảo ảnh bao phủ toàn bộ thẻ mà không bị méo
                                                width: '100%',        // Đặt chiều rộng ảnh 100%
                                                height: '100%'        // Đặt chiều cao ảnh 100%
                                            }}
                                        />
                                        <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            {product.status ? 'Available' : 'Sold Out'}
                                        </span>
                                    </Link>

                                    <div className="product-card__content mt-16">
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link to={`/product-details/${product.id}`} className="link text-line-2" tabIndex={0}>
                                                {product.productName}
                                            </Link>
                                        </h6>
                                        <div className="flex-align mb-20 mt-16 gap-6">
                                            <span className="text-xs fw-medium text-gray-500">{product.rating}</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                {formatVND(product.price * 1.5) && `${formatVND(product.price * 1.5)}`}
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                {formatVND(product.price)} <span className="text-gray-500 fw-normal">/Qty</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)} // Thêm vào giỏ hàng
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Start */}
                        <ul className="pagination flex-center flex-wrap gap-16">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index && 'active'}`}>
                                    <button
                                        className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                        onClick={() => handlePageChange(index)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {/* Pagination End */}
                    </div>
                    {/* Content End */}
                </div>
            </div>
        </section>
    );
};

export default ShopSection;
