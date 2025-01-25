import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactSlider from 'react-slider'
import Product_Services from '../services/product'

const ShopSection = () => {

    let [grid, setGrid] = useState(false)

    let [active, setActive] = useState(false)
    let sidebarController = () => {
        setActive(!active)
    }

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await Product_Services.Product_Category(6); // Gọi API để lấy danh sách danh mục
                setCategories(data); // Lưu danh sách vào state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const fetchProducts = async (page = 0, size = 9, sortDirection = 'asc') => {
        try {
            const response = await Product_Services.Product_Search({
                page,
                size,
                sortDirection,
            });
            setProducts(response.content); // Lưu danh sách sản phẩm vào state
            setTotalPages(response.totalPages); // Lưu tổng số trang
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    useEffect(() => {
        fetchProducts(currentPage); // Fetch sản phẩm khi component mount
    }, [currentPage]);
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
    };


    return (
        <section className="shop py-80">
            <div className={`side-overlay ${active && "show"}`}></div>
            <div className="container container-lg">
                <div className="row">
                    {/* Sidebar Start */}
                    <div className="col-lg-3">
                        <div className={`shop-sidebar ${active && "active"}`}>
                            <button onClick={sidebarController}
                                type="button"
                                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
                            >
                                <i className="ph ph-x" />
                            </button>
                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                    Danh Mục Sản Phẩm
                                </h6>
                                <ul className="max-h-540 overflow-y-auto scroll-sm">
                                    {categories.map((category) => (
                                        <li className="mb-24" key={category.settingId}>
                                            <Link
                                                to={`/products?category=${category.id}`}
                                                className="text-gray-900 hover-text-main-600"
                                            >
                                                {category.settingName} ({category.count})
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                    Sắp Xếp Theo Giá
                                </h6>
                                <div className="custom--range">
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        defaultValue={[0, 100]}
                                        ariaLabel={['Lower thumb', 'Upper thumb']}
                                        ariaValuetext={state => `Thumb value ${state.valueNow}`}
                                        renderThumb={(props, state) => {
                                            const { key, ...restProps } = props;
                                            return <div {...restProps} key={state.index}>{state.valueNow}</div>;
                                        }}
                                        pearling
                                        minDistance={10}
                                    />

                                    <br />
                                    <br />
                                    <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                                        <button type="button" className="btn btn-main h-40 flex-align">
                                            Filter{" "}
                                        </button>

                                    </div>
                                </div>
                            </div>

                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                    Sắp Xếp Theo Đánh Giá
                                </h6>
                                <div className="flex-align gap-8 position-relative mb-20">
                                    <label
                                        className="position-absolute w-100 h-100 cursor-pointer"
                                        htmlFor="rating5"
                                    >
                                        {" "}
                                    </label>
                                    <div className="common-check common-radio mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="rating5"
                                        />
                                    </div>
                                    <div
                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                        role="progressbar"
                                        aria-label="Basic example"
                                        aria-valuenow={70}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className="progress-bar bg-main-600 rounded-pill"
                                            style={{ width: "70%" }}
                                        />
                                    </div>
                                    <div className="flex-align gap-4">
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                    </div>
                                    <span className="text-gray-900 flex-shrink-0">124</span>
                                </div>
                                <div className="flex-align gap-8 position-relative mb-20">
                                    <label
                                        className="position-absolute w-100 h-100 cursor-pointer"
                                        htmlFor="rating4"
                                    >
                                        {" "}
                                    </label>
                                    <div className="common-check common-radio mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="rating4"
                                        />
                                    </div>
                                    <div
                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                        role="progressbar"
                                        aria-label="Basic example"
                                        aria-valuenow={50}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className="progress-bar bg-main-600 rounded-pill"
                                            style={{ width: "50%" }}
                                        />
                                    </div>
                                    <div className="flex-align gap-4">
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                    </div>
                                    <span className="text-gray-900 flex-shrink-0">52</span>
                                </div>
                                <div className="flex-align gap-8 position-relative mb-20">
                                    <label
                                        className="position-absolute w-100 h-100 cursor-pointer"
                                        htmlFor="rating3"
                                    >
                                        {" "}
                                    </label>
                                    <div className="common-check common-radio mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="rating3"
                                        />
                                    </div>
                                    <div
                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                        role="progressbar"
                                        aria-label="Basic example"
                                        aria-valuenow={35}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className="progress-bar bg-main-600 rounded-pill"
                                            style={{ width: "35%" }}
                                        />
                                    </div>
                                    <div className="flex-align gap-4">
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                    </div>
                                    <span className="text-gray-900 flex-shrink-0">12</span>
                                </div>
                                <div className="flex-align gap-8 position-relative mb-20">
                                    <label
                                        className="position-absolute w-100 h-100 cursor-pointer"
                                        htmlFor="rating2"
                                    >
                                        {" "}
                                    </label>
                                    <div className="common-check common-radio mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="rating2"
                                        />
                                    </div>
                                    <div
                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                        role="progressbar"
                                        aria-label="Basic example"
                                        aria-valuenow={20}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className="progress-bar bg-main-600 rounded-pill"
                                            style={{ width: "20%" }}
                                        />
                                    </div>
                                    <div className="flex-align gap-4">
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                    </div>
                                    <span className="text-gray-900 flex-shrink-0">5</span>
                                </div>
                                <div className="flex-align gap-8 position-relative mb-0">
                                    <label
                                        className="position-absolute w-100 h-100 cursor-pointer"
                                        htmlFor="rating1"
                                    >
                                        {" "}
                                    </label>
                                    <div className="common-check common-radio mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="rating1"
                                        />
                                    </div>
                                    <div
                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                        role="progressbar"
                                        aria-label="Basic example"
                                        aria-valuenow={5}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className="progress-bar bg-main-600 rounded-pill"
                                            style={{ width: "5%" }}
                                        />
                                    </div>
                                    <div className="flex-align gap-4">
                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-xs fw-medium text-gray-400 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                    </div>
                                    <span className="text-gray-900 flex-shrink-0">2</span>
                                </div>
                            </div>


                            <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                    Sắp Xếp Theo Cửa Hàng
                                </h6>
                                <ul className="max-h-540 overflow-y-auto scroll-sm">
                                    <li className="mb-24">
                                        <div className="form-check common-check common-radio">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="brand"
                                                id="brand1"
                                            />
                                            <label className="form-check-label" htmlFor="brand1">
                                                Adidas
                                            </label>
                                        </div>
                                    </li>


                                    <li className="mb-0">
                                        <div className="form-check common-check common-radio">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="brand"
                                                id="brand7"
                                            />
                                            <label className="form-check-label" htmlFor="brand7">
                                                GAP
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="shop-sidebar__box rounded-8">
                                <img src="assets/images/thumbs/advertise-img1.png" alt="" />
                            </div>
                        </div>
                    </div>
                    {/* Sidebar End */}
                    {/* Content Start */}
                    <div className="col-lg-9">
                        {/* Top Start */}
                        <div className="flex-between gap-16 flex-wrap mb-40 ">
                            <span className="text-gray-900">Showing 1-20 of 85 result</span>
                            <div className="position-relative flex-align gap-16 flex-wrap">
                                <div className="list-grid-btns flex-align gap-16">
                                    <button onClick={() => setGrid(true)}
                                        type="button"
                                        className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${grid === true && "border-main-600 text-white bg-main-600"}`}
                                    >
                                        <i className="ph-bold ph-list-dashes" />
                                    </button>
                                    <button onClick={() => setGrid(false)}
                                        type="button"
                                        className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${grid === false && "border-main-600 text-white bg-main-600"}`}
                                    >
                                        <i className="ph ph-squares-four" />
                                    </button>
                                </div>
                                <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                                    <label htmlFor="sorting" className="text-inherit flex-shrink-0">
                                        Sort by:{" "}
                                    </label>
                                    <select defaultValue={1}
                                        className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                                        id="sorting"
                                    >
                                        <option value={1} >
                                            Popular
                                        </option>
                                        <option value={1}>Latest</option>
                                        <option value={1}>Trending</option>
                                        <option value={1}>Matches</option>
                                    </select>
                                </div>
                                <button onClick={sidebarController}
                                    type="button"
                                    className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                                >
                                    <i className="ph-bold ph-funnel" />
                                </button>
                            </div>
                        </div>
                        {/* Top End */}
                        <div className={`list-grid-wrapper ${grid && "list-view"}`}>
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
                                >
                                    <Link
                                        to={`/product-details/${product.id}`}
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <img
                                            src={product.imageUrls[0] || 'default-image-url.png'}
                                            alt={product.productName}
                                            className="w-auto max-w-unset"
                                        />
                                        <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            {product.status ? 'Available' : 'Sold Out'}
                                        </span>
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to={`/product-details/${product.id}`}
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
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
                                                {product.originalPrice && `$${product.originalPrice}`}
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                ${product.price} <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Start */}
                        <ul className="pagination flex-center flex-wrap gap-16">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${index === currentPage ? 'active' : ''}`}
                                >
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

    )
}

export default ShopSection