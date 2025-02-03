import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
    TextField, IconButton, Paper, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
    Select, MenuItem, FormControl, InputLabel, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import axiosInstance from '../services/axios';
import Shop_Services from '../services/shop';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [shippingStatusFilter, setShippingStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [shopId, setShopId] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        const fetchShopId = async () => {
            try {
                const shopData = await Shop_Services.Get_Shops_By_User();
                if (shopData && shopData.content && shopData.content.length > 0) {
                    setShopId(shopData.content[0].shopId);
                } else {
                    setError('Không tìm thấy cửa hàng nào.');
                }
            } catch (error) {
                setError('Lỗi khi lấy danh sách cửa hàng: ' + error.message);
            }
        };
        fetchShopId();
    }, []);

    useEffect(() => {
        if (shopId) {
            getOrdersByShop();
        }
    }, [shopId, page, search, paymentStatus, shippingStatusFilter]);

    const getOrdersByShop = async () => {
        if (!shopId) return;
        try {
            const params = {
                shopId,
                ...(search && { search }),
                ...(paymentStatus && { paymentStatus }),
                ...(shippingStatusFilter && { shippingStatus: shippingStatusFilter }),
                page,
                size,
            };
            const queryParams = new URLSearchParams(Object.entries(params).filter(([v]) => v !== ''));
            const { data } = await axiosInstance.get(`api/v1/shop_staff/order/list?${queryParams.toString()}`);

            if (Array.isArray(data.orders)) {
                setOrders(data.orders);
                setTotalPages(data.totalPage || 1);
            } else {
                setError('Orders data is not in correct format');
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleEditOrder = (order) => {
        setCurrentOrder(order);
        setOpenEditModal(true);
    };

    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter((order) => order.orderId !== orderId));
    };

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
                            <TableCell align="center">Hành động</TableCell>
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
                                    <IconButton onClick={() => handleEditOrder(order)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOrder(order.orderId)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
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

export default OrderManagement;
