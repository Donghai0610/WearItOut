import React from 'react'

const NewsletterTwo = () => {
    return (
        <div className="newsletter-two bg-neutral-600 py-32">
            <div className="container container-lg">
                <div className="flex-between gap-20 flex-wrap">
                    <div className="flex-align gap-22">
                        <span className="d-flex">
                            <img src="assets/images/icon/envelop.png" alt="" />
                        </span>
                        <div>
                            <h5 className="text-white mb-12 fw-medium">
                                Tham gia nhận bản tin, giảm 10%
                            </h5>
                            <p className="text-white fw-light">
                                Nhận thông tin mới nhất về sự kiện, giảm giá và ưu đãi
                            </p>
                        </div>
                    </div>
                    <form action="#" className="newsletter-two__form w-50">
                        <div className="flex-align gap-16">
                            <input
                                type="text"
                                className="common-input style-two rounded-8 flex-grow-1 py-14"
                                placeholder="Nhập địa chỉ email của bạn"
                            />
                            <button
                                type="submit"
                                className="btn btn-main-two flex-shrink-0 rounded-8 py-16"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewsletterTwo
