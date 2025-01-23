import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Product_Services from '../services/product';

const TrendingOne = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0); // Mặc định là "All"
    const [products, setProducts] = useState([]);
    const itemsPerPage = 6;

    // Lấy danh sách danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await Product_Services.Product_Category();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Lấy sản phẩm theo danh mục
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await Product_Services.Product_Trending(selectedCategory, itemsPerPage);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    return (
        <section className="trending-productss pt-80">
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Sản phẩm xu hướng</h5>
                            <ul className="nav common-tab style-two nav-pills" id="pills-tab" role="tablist">
                                {/* Nút "All" */}
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${selectedCategory === 0 ? 'active' : ''}`} 
                                        onClick={() => setSelectedCategory(0)}
                                    >
                                        All
                                    </button>
                                </li>
                                {/* Hiển thị danh mục từ API */}
                                {categories.map(category => (
                                    <li className="nav-item" role="presentation" key={category.settingId}>
                                        <button 
                                            className={`nav-link ${selectedCategory === category.settingId ? 'active' : ''}`} 
                                            onClick={() => setSelectedCategory(category.settingId)}
                                        >
                                            {category.settingName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="trending-products-box rounded-16 overflow-hidden flex-between position-relative mb-24">
                        <div className="d-md-block d-none ps-xxl-5 ps-md-4">
                            <img src="https://images.pexels.com/photos/3856556/pexels-photo-3856556.jpeg?auto=compress&cs=tinysrgb&h=227&w=462"
                                alt="Thời trang second-hand" />
                        </div>
                        <div className="trending-products-box__content px-4 d-block w-100 text-center py-32">
                            <h6 className="mb-0 trending-products-box__title">
                                <span className="h4 mb-0 fw-semibold">Thời Trang Second-Hand & Vintage</span>
                                <br />
                                Giảm giá lên đến <span className="h4 mb-0 fw-semibold">50%</span> – Phong Cách Bền Vững!
                                <br />
                                Mua ngay chỉ từ <span className="h4 mb-0 fw-semibold">100.000đ</span>!
                            </h6>
                        </div>
                        <div className="d-md-block d-none pe-xxl-5 me-xxl-5 pe-md-4">
                            <img src="https://images.pexels.com/photos/1172014/pexels-photo-1172014.jpeg?auto=compress&cs=tinysrgb&h=227&w=379"
                                alt="Thời trang vintage" />
                        </div>
                    </div>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-all" role="tabpanel"
                            aria-labelledby="pills-all-tab" tabIndex={0}>
                            <div className="row g-12">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6" key={product.id}>
                                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                <Link to={`/product-details/${product.id}`} className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                                                    <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                        {product.rating >= 4.5 ? 'Best Seller' : 'Trending'}
                                                    </span>
                                                    <img src={product.imageUrls.length > 0 ? product.imageUrls[0] : "https://via.placeholder.com/150"}
                                                        alt={product.productName} className="w-auto max-w-unset" />
                                                </Link>
                                                <div className="product-card__content mt-16">
                                                    <span className="text-success-600 bg-success-50 text-sm fw-medium py-4 px-8">
                                                        {Math.floor(Math.random() * 30) + 10}% OFF
                                                    </span>
                                                    <h6 className="title text-lg fw-semibold my-16">
                                                        <Link to={`/product-details/${product.id}`} className="link text-line-2">
                                                            {product.productName}
                                                        </Link>
                                                    </h6>
                                                    <div className="flex-align gap-6">
                                                        <span className="text-xs fw-medium text-gray-500">{product.rating} ⭐</span>
                                                    </div>
                                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                        Cửa hàng: {product.shopName}
                                                    </span>
                                                    <div className="product-card__price mt-16 mb-30">
                                                        <span className="text-heading text-md fw-semibold ">
                                                            {product.price.toLocaleString()} đ
                                                        </span>
                                                    </div>
                                                    <span className="text-neutral-600">
                                                        Danh mục: <span className="text-main-600">{product.settingName}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center w-100">Không có sản phẩm nào</p>
                                )}
                            </div>
                        </div>
                    </div>     
                </div>
            </div>
        </section>
    );
};

export default TrendingOne;
