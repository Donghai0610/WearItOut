const formatVND = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ'; // Định dạng số kiểu Việt Nam
};
export default formatVND;