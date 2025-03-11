import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
    TextField, IconButton, Paper, Pagination, Select, MenuItem, FormControl, InputLabel, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from '../services/axios';
import Shop_Services from '../services/shop';
import Account_Service from '../services/account';
import Order_Service from '../services/orderService';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderManagementUser = () => {
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [shippingStatusFilter, setShippingStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
   const navigate = useNavigate(); // Khai báo navigate
    const location = useLocation();
    // Gọi API lấy đơn hàng
    const getOrdersByShop = async () => {
        const userId = Account_Service.getUserIdFromToken(); // Lấy userId từ token
        if (!userId) {
            setError('Không tìm thấy userId');
            return;
        }

        try {
            // Gọi hàm từ Order_Service để lấy danh sách sản phẩm đã mua của người dùng
            const data = await Order_Service.getPurchasedProductsByUser(userId);

            if (Array.isArray(data)) {
                // Giả sử bạn đã nhận được một mảng các đơn hàng trong `data`
                setOrders(data);
                setTotalPages(Math.ceil(data.length / size)); // Tính toán tổng số trang
            } else {
                setError('Dữ liệu đơn hàng không hợp lệ');
            }
        } catch (error) {
            setError(error.message);
            console.error('Lỗi khi lấy đơn hàng:', error);
        }
    };

    // Xử lý sự kiện phân trang
    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    // Xử lý khi nhấn nút "Sửa"
    const handleEditOrder = (order) => {
        // Logic chỉnh sửa đơn hàng (hiện tại chưa có)
        console.log("Editing order:", order);
    };

    // Xử lý khi nhấn nút "Xóa"
    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter((order) => order.orderId !== orderId));
    };
useEffect(() => {
        getOrdersByShop();
    }
    , []);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const orderId = params.get('orderCode');
    
        if (status === 'CANCELLED') {
            // Hiển thị SweetAlert thông báo thanh toán bị hủy
            Swal.fire({
                icon: 'info',
                title: 'Thanh toán bị hủy',
                text: 'Quý khách đã hủy thanh toán. Bạn sẽ được chuyển về trang chủ.',
                confirmButtonText: 'OK',
            }).then(async () => {
                try {
                    // Gọi phương thức xử lý hủy thanh toán
                    const result = await Order_Service.handlePaymentCancel(orderId);
    
                    // Kiểm tra kết quả trả về từ API
                    if (result && result.success) {
                        // Nếu thành công, chuyển hướng về trang chủ
                        navigate('/');
                    } else {
                        // Nếu có lỗi, hiển thị thông báo lỗi
                        Swal.fire({
                            icon: 'error',
                            title: 'Có lỗi xảy ra',
                            text: 'Không thể hủy thanh toán. Vui lòng thử lại.',
                        });
                    }
                } catch (error) {
                    // Nếu có lỗi khi gọi API hủy thanh toán
                    Swal.fire({
                        icon: 'error',
                        title: 'Có lỗi xảy ra',
                        text: 'Không thể xử lý việc hủy thanh toán. Vui lòng thử lại sau!',
                    });
                    console.error('Error while canceling payment:', error);
                }
            });
        }
    
        if (status === 'PAID') {
            // Hiển thị SweetAlert thông báo thanh toán thành công
            Swal.fire({
                icon: 'success',
                title: 'Thanh toán thành công',
                text: 'Quý khách hãy chờ xác nhận từ website. Bạn sẽ được chuyển về trang quản lý đơn hàng.',
                confirmButtonText: 'OK',
            }).then(async () => {
                try {
                    // Gọi phương thức để cập nhật trạng thái thanh toán
                    const result = await Order_Service.handlePaymentSuccess(orderId);
    
                    if (result && result.success) {
                        // Chuyển hướng về trang quản lý đơn hàng nếu cập nhật thành công
                        navigate('/order-user');
                    } else {
                        // Nếu có lỗi, hiển thị thông báo lỗi
                        Swal.fire({
                            icon: 'error',
                            title: 'Có lỗi xảy ra',
                            text: 'Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.',
                        });
                    }
                } catch (error) {
                    // Nếu có lỗi khi cập nhật trạng thái thanh toán
                    Swal.fire({
                        icon: 'error',
                        title: 'Có lỗi xảy ra',
                        text: 'Không thể xử lý thanh toán thành công. Vui lòng thử lại sau!',
                    });
                    console.error('Error while updating payment status:', error);
                }
            });
        }
    
    }, [location, navigate]);
    return (
        <div style={{ padding: 20 }}>
            {/* Bộ lọc tìm kiếm */}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                <TextField
                    label="Tìm kiếm đơn hàng"
                    variant="outlined"
                    size="small"
                    style={{ marginRight: 10, flex: 1 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FormControl variant="outlined" size="small" style={{ marginRight: 10, minWidth: 150 }}>
                    <InputLabel>Trạng thái thanh toán</InputLabel>
                    <Select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        label="Trạng thái thanh toán"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Paid">Đã thanh toán</MenuItem>
                        <MenuItem value="Unpaid">Chưa thanh toán</MenuItem>
                        <MenuItem value="Cancel">Đã hủy</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" style={{ marginRight: 10, minWidth: 180 }}>
                    <InputLabel>Trạng thái vận chuyển</InputLabel>
                    <Select
                        value={shippingStatusFilter}
                        onChange={(e) => setShippingStatusFilter(e.target.value)}
                        label="Trạng thái vận chuyển"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Processed">Đã xử lý</MenuItem>
                        <MenuItem value="Shipped">Đã giao</MenuItem>
                        <MenuItem value="Out For Delivery">Đang giao hàng</MenuItem>
                        <MenuItem value="Delivered">Đã nhận hàng</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={getOrdersByShop}>
                    Tìm kiếm
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Mã đơn</TableCell>
                            <TableCell align="center">Tên khách hàng</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Số điện thoại</TableCell>
                            <TableCell align="center">Trạng thái thanh toán</TableCell>
                            <TableCell align="center">Trạng thái vận chuyển</TableCell>
                            <TableCell align="center">Tổng tiền</TableCell>
                            {/* <TableCell align="center">Hành động</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, index) => (
                            <TableRow key={order.orderId}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{order.orderId}</TableCell>
                                <TableCell align="center">{order.customerName}</TableCell>
                                <TableCell align="center">{order.customerEmail}</TableCell>
                                <TableCell align="center">{order.customerPhone}</TableCell>
                                <TableCell align="center">
                                    <span style={{ color: order.paymentStatus === "PAID" ? "green" : "red" }}>
                                        {order.paymentStatus}
                                    </span>
                                </TableCell>
                                <TableCell align="center">{order.shippingStatus}</TableCell>
                                <TableCell align="center">{order.totalPrice} VND</TableCell>
                                <TableCell align="center">
                                    {/* <IconButton onClick={() => handleEditOrder(order)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOrder(order.orderId)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phân trang */}
            <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
            />
        </div>
    );
};

export default OrderManagementUser;
