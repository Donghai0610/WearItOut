import { useEffect } from "react";
import { motion } from "framer-motion";

const WearFitsViewer = () => {
    return (
        <div className="my-5 text-center">
            {/* Thêm CSS trực tiếp vào trang */}
            <style>
                {`
                    .same-size-img {
                        width: 100%;
                        height: 700px;
                        object-fit: cover;
                    }
                `}
            </style>

            {/* Mô tả trang web */}
            <h2 className="mb-4">Khám Phá Bộ Sưu Tập Dành Cho Bạn!</h2>
            <p className="fs-4 mb-5">
                Truy cập vào "Check Outfit!" để trải nghiệm công cụ xem thử các bộ đồ phù hợp với kích thước và phong
                cách của bạn. Bạn sẽ có thể thử các bộ trang phục trực tuyến và tìm được những lựa chọn tuyệt vời để làm
                mới tủ đồ của mình. Hãy cùng bắt đầu hành trình thử đồ ngay hôm nay!
            </p>

            {/* Thêm hình ảnh minh họa về trang web */}
            <div className="row mb-5">
                <div className="col-md-4 mb-4">
                    <img
                        src="/assets/images/tryon/phongcachhiendai.jpg"
                        alt="Phong cách hiện đại"
                        className="img-fluid rounded shadow same-size-img"
                    />
                    <p className="mt-2">Mẫu trang phục 1 - Phong cách hiện đại</p>
                </div>
                <div className="col-md-4 mb-4">
                    <img
                        src="/assets/images/tryon/thanhdichchomoidip.png"
                        alt="Thành tích cho mới dip"
                        className="img-fluid rounded shadow same-size-img"
                    />
                    <p className="mt-2">Mẫu trang phục 2 - Thoải mái và dễ chịu</p>
                </div>
                <div className="col-md-4 mb-4">
                    <img
                        src="/assets/images/tryon/thoaimaidechiu.jpg"
                        alt="Thanh lịch cho mọi dịp"
                        className="img-fluid rounded shadow same-size-img"
                    />
                    <p className="mt-2">Mẫu trang phục 3 - Thanh lịch cho mọi dịp</p>
                </div>
            </div>

            {/* Cung cấp thêm thông tin về cách thử đồ */}
            <h3 className="mb-4">Một Số Mẫu Cơ Bản Để Bạn Có Thể Xem Và Thử</h3>
            <p className="fs-5 mb-5">
                Chúng tôi cung cấp một số mẫu cơ bản giúp bạn dễ dàng thử đồ và tìm được những bộ trang phục phù hợp
                nhất. Hãy tham khảo các mẫu dưới đây và nhấn vào nút "Check Outfit!" để bắt đầu thử đồ ngay bây giờ!
            </p>

            {/* Nút truy cập trang web */}
            <motion.a
                href="https://dev.wearfits.com/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xxxxxl btn-warning px-10 py-8 shadow-lg fw-bold text-uppercase fs-1 rounded-pill border border-dark"
                whileHover={{scale: 1.8, backgroundColor: "#ffcc00", color: "#000"}}
                whileTap={{scale: 0.9}}
                transition={{duration: 0.2}}
            >
                🚀 Custom Size Room !
            </motion.a>
        </div>
    );
};

export default WearFitsViewer;
