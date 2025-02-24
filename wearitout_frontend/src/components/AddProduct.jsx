import React, { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Product_Services from "../services/product";
import Shop_Services from "../services/shop";
import Account_Services from "../services/account";
import CreateShopModal from "./CreateShopModal";

const AddProduct = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [status] = useState("Active");
  const [settingName, setSettingName] = useState("");
  const [shopName, setShopName] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openShopModal, setOpenShopModal] = useState(false); // State để mở modal đăng ký shop

  // Lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await Product_Services.Product_Category(6);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy shopName từ userId trong token
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const userId = await Account_Services.getUserIdFromToken();
        if (!userId) {
          throw new Error("Không tìm thấy userId từ token!");
        }

        const data = await Shop_Services.Get_Shops_By_User(userId);
        if (data.content.length > 0) {
          setShopName(data.content[0].shopName);
        } else {

          Swal.fire({
            title: "Bạn chưa có Shop!",
            text: "Vui lòng đăng ký shop trước khi thêm sản phẩm.",
            icon: "warning",
            confirmButtonText: "Đăng ký ngay",
          }).then(() => {
            setOpenShopModal(true);
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy shopName:", error);
      }
    };
    fetchShop();
  }, []);

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  // ✅ Fix lỗi nhập từng số trong `price`
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số

    if (value === "") {
      setPrice("");
      setFormattedPrice("");
      return;
    }

    setPrice(value); // Giữ nguyên giá trị nhập

    let num = parseInt(value, 10);
    if (num > 50000000) num = 50000000; // Giới hạn tối đa
    setFormattedPrice(num.toLocaleString("vi-VN") + " VND");
  };

  // Xử lý khi submit form
  const handleAddProduct = async () => {
    if (!productName || !description || !price || !settingName || !shopName) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
      return;
    }

    const newProduct = {
      productName,
      description,
      price: parseInt(price, 10),
      stockQuantity,
      rating: 0.0, // ✅ Đặt rating mặc định là 0.0
      status,
      settingName,
      shopName,
      imageFiles,
    };

    try {
      const response = await Product_Services.Add_Product(newProduct);
      console.log("Sản phẩm đã thêm thành công:", response);

      Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được thêm thành công!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/shop-management");
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      Swal.fire("Lỗi", "Không thể thêm sản phẩm. Vui lòng thử lại!", "error");
    }
  };
  const handleShopCreated = async () => {
    setOpenShopModal(false);
    const userId = await Account_Services.getUserIdFromToken();
    const data = await Shop_Services.Get_Shops_By_User(userId);
    if (data.content.length > 0) {
      setShopName(data.content[0].shopName);
    }
  };
  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto", backgroundColor: "#fff", borderRadius: 2 }}>
      {/* Nút Quay lại */}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={() => navigate("/shop-management")}>
          Quay lại quản lý sản phẩm
        </Button>
      </Box>
      {/* Hiển thị Modal đăng ký shop khi cần */}
      <CreateShopModal open={openShopModal} handleClose={() => setOpenShopModal(false)} onShopCreated={handleShopCreated} />

      <h2 style={{ textAlign: "center", color: "#673AB7" }}>Thêm Sản Phẩm</h2>

      <TextField fullWidth label="Tên sản phẩm *" variant="outlined" margin="normal" value={productName} onChange={(e) => setProductName(e.target.value)} />

      <TextField fullWidth label="Mô tả sản phẩm *" variant="outlined" margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

      <TextField fullWidth label="Giá sản phẩm (VND) *" variant="outlined" margin="normal" value={price} onChange={handlePriceChange} helperText={formattedPrice} />

      <FormControl fullWidth margin="normal">
        <InputLabel>Danh mục *</InputLabel>
        <Select value={settingName} onChange={(e) => setSettingName(e.target.value)}>
          {categories.map((category) => (
            <MenuItem key={category.settingId} value={category.settingName}>
              {category.settingName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField fullWidth label="Tên Shop" variant="outlined" margin="normal" value={shopName} disabled />

      <TextField fullWidth label="Số lượng tồn kho" type="number" variant="outlined" margin="normal" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />

      <TextField fullWidth label="Trạng thái" variant="outlined" margin="normal" value={status} disabled />

      <Box mt={2}>
        <input type="file" multiple onChange={handleImageChange} />
        {imageFiles.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <strong>Hình ảnh đã chọn:</strong>
            <ul>
              {imageFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Paper>
        )}
      </Box>

      <Button fullWidth variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={handleAddProduct}>
        Thêm Sản Phẩm
      </Button>
    </Box>
  );
};

export default AddProduct;
