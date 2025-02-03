import React, { useState, useEffect } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Paper } from "@mui/material";
import Product_Services from "../services/product";
import Swal from "sweetalert2";

const UpdateProductForm = ({ product, onClose, fetchProducts }) => {
  const [productName, setProductName] = useState(product.productName);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity);
  const [settingName, setSettingName] = useState(product.settingName);
  const [status, setStatus] = useState(product.status);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);

  // Lấy danh mục sản phẩm từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await Product_Services.Product_Category(6);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        Swal.fire("Lỗi", "Không thể lấy danh mục sản phẩm. Vui lòng thử lại!", "error");
      }
    };
    fetchCategories();
  }, []);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  // Xử lý khi submit form
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("settingName", settingName);
    formData.append("status", status);

    // Thêm ảnh vào FormData
    imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });

    try {
      const response = await Product_Services.Update_Product(product.id, formData); // Gọi API với FormData
      Swal.fire("Thành công!", "Sản phẩm đã được cập nhật!", "success");
      fetchProducts(); // Gọi lại fetchProducts để cập nhật danh sách sản phẩm
      onClose(); // Đóng modal
    } catch (error) {
      Swal.fire("Lỗi", "Không thể cập nhật sản phẩm. Vui lòng thử lại!", "error");
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Tên sản phẩm"
        variant="outlined"
        margin="normal"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Mô tả sản phẩm"
        variant="outlined"
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        fullWidth
        label="Giá sản phẩm"
        variant="outlined"
        margin="normal"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <TextField
        fullWidth
        label="Số lượng tồn kho"
        variant="outlined"
        margin="normal"
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
      />

      {/* Select cho Setting Name */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={settingName}
          onChange={(e) => setSettingName(e.target.value)}
          label="Danh mục"
        >
          {categories.map((category) => (
            <MenuItem key={category.settingId} value={category.settingName}>
              {category.settingName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Trạng thái sản phẩm */}
      <TextField
        fullWidth
        label="Trạng thái"
        variant="outlined"
        margin="normal"
        value={status}
        disabled
      />

      {/* Chọn ảnh */}
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

      <Button fullWidth variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={handleSubmit}>
        Cập nhật sản phẩm
      </Button>
    </div>
  );
};

export default UpdateProductForm;
