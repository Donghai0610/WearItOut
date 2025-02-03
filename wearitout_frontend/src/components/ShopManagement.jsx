import React, { useState, useEffect } from "react";
import { Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import Shop_Services from "../services/shop";
import Product_Services from "../services/product";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UpdateProductForm from "./UpdateProductForm"; // Import form sửa sản phẩm

const ShopManagement = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchProductName, setSearchProductName] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const navigate = useNavigate();

    // Hàm gọi API để lấy sản phẩm
    const fetchProducts = async () => {
        try {
            console.log("Fetching products...");
            const data = await Shop_Services.Get_Product_By_Shop_Id_User_Id({
                page,
                size: 10,
                productName: searchProductName,
            });
            console.log("Products fetched:", data);
            setProducts(data.content);
            setTotalItems(data.totalElements);
        } catch (error) {
            console.error("Không thể lấy sản phẩm", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchProductName]);

    const handleAddProduct = () => {
        navigate("/add-product");
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await Product_Services.Delete_Product(productId);
            console.log("Product deleted", response);
            Swal.fire("Thành công!", "Sản phẩm đã được xóa!", "success");
            fetchProducts(); // Cập nhật lại danh sách sản phẩm
        } catch (error) {
            console.error("Error deleting product", error);
            Swal.fire("Lỗi", "Không thể xóa sản phẩm, vui lòng thử lại!", "error");
        }
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product); // Lưu sản phẩm vào state để sửa
        setOpenEditModal(true); // Mở modal sửa sản phẩm
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1); // Pagination bắt đầu từ 0
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProduct}>
                    Thêm mới
                </Button>
                <div>
                    <TextField
                        label="Tìm kiếm sản phẩm"
                        variant="outlined"
                        size="small"
                        style={{ marginRight: 10 }}
                        value={searchProductName}
                        onChange={(e) => setSearchProductName(e.target.value)}
                    />
                    <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={() => console.log("Xuất file Excel")}>
                        Xuất ra Excel
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên sản phẩm</TableCell>
                            <TableCell align="center">Ảnh</TableCell>
                            <TableCell align="center">Giá</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">Danh mục</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{product.productName}</TableCell>
                                <TableCell align="center">
                                    <img src={product.imageUrls[0]} alt={product.productName} style={{ width: 50, height: 50 }} />
                                </TableCell>
                                <TableCell align="center">{product.price}</TableCell>
                                <TableCell align="center">{product.stockQuantity}</TableCell>
                                <TableCell align="center">{product.settingName}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleEditProduct(product)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteProduct(product.id)} color="secondary">
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
                count={Math.ceil(totalItems / 10)} // Số trang (tính theo số sản phẩm mỗi trang là 10)
                page={page + 1} // Hiển thị số trang bắt đầu từ 1
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
            />

            {/* Modal Edit Product */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <DialogTitle>Sửa Sản Phẩm</DialogTitle>
                <DialogContent>
                    <UpdateProductForm product={currentProduct} onClose={() => setOpenEditModal(false)} fetchProducts={fetchProducts} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ShopManagement;
