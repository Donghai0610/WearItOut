import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Product_Services from '../services/product';

const NewArrivalTwo = () => {
    const [products, setProducts] = useState([]);
    const { id } = useParams();
    const productId = parseInt(id, 10);

    useEffect(() => {
        const fetchSameProducts = async () => {
            try {
                const response = await Product_Services.Same_Product(productId);
                setProducts(response); // Assuming the API returns an array of products
            } catch (error) {
                console.error('Error fetching same products:', error);
            }
        };

        if (productId) {
            fetchSameProducts();
        }
    }, [productId]);

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-right" />
            </button>
        );
    }

    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1, // Display 1 product per slide
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        centerMode: true, // Ensures the product is centered
        centerPadding: '0', // Remove any extra space on the sides
        responsive: [
            {
                breakpoint: 1599,
                settings: { slidesToShow: 4, centerMode: false },
            },
            {
                breakpoint: 1399,
                settings: { slidesToShow: 3, centerMode: false },
            },
            {
                breakpoint: 992,
                settings: { slidesToShow: 2, centerMode: false },
            },
            {
                breakpoint: 575,
                settings: { slidesToShow: 1 },
            },
            {
                breakpoint: 424,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <section className="new-arrival pb-80">
            <div className="container container-lg">
                <div className="section-heading">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0">Sản Phẩm Khác Của Shop </h5>
                        <div className="flex-align mr-point gap-16">
                            <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                               Tất cả sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="new-arrival__slider arrow-style-two">
                    <Slider {...settings}>
                        {products.length > 0 ? (
                            products.map((product) => {
                                const priceVND = product.price; // Assuming the price is in VND
                                const oldPriceVND = product.price * 1.5; // Old price is 1.5 times the original price

                                return (
                                    <div key={product.id} className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                        {product.discount && <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50%</span>}
                                        <Link to={`/product-details/${product.id}`} className="product-card__thumb flex-center">
                                            <img src={product.imageUrls[0]} alt={product.productName} />
                                        </Link>
                                        <div className="product-card__content p-sm-2">
                                            <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                                <Link to={`/product-details/${product.id}`} className="link text-line-2">
                                                    {product.productName}
                                                </Link>
                                            </h6>
                                            <div className="flex-align gap-4">
                                                <span className="text-main-600 text-md d-flex">
                                                    <i className="ph-fill ph-storefront" />
                                                </span>
                                                <span className="text-gray-500 text-xs">By {product.shopName}</span>
                                            </div>
                                            <div className="product-card__content mt-12">
                                                <div className="product-card__price mb-8">
                                                    <span className="text-heading text-md fw-semibold">
                                                        {priceVND} VND <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        {oldPriceVND} VND
                                                    </span>
                                                </div>
                                                <div className="flex-align gap-6">
                                                    <span className="text-xs fw-bold text-gray-600">{product.rating}</span>
                                                    <span className="text-15 fw-bold text-warning-600 d-flex">
                                                        <i className="ph-fill ph-star" />
                                                    </span>
                                                    <span className="text-xs fw-bold text-gray-600">({product.reviews}k)</span>
                                                </div>
                                                <Link
                                                    to="/cart"
                                                    className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                                >
                                                    Add To Cart <i className="ph ph-shopping-cart" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No products available.</p>
                        )}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default NewArrivalTwo;
