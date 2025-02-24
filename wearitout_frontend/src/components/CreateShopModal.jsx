import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import Shop_Services from "../services/shop"; // Import service gọi API
import Product_Services from "../services/product"; // Import service để lấy danh mục
import Account_Service from "../services/account"; // Import lấy userId

const CreateShopModal = ({ open, handleClose, onShopCreated }) => {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [settingId, setSettingId] = useState(""); // Lưu `settingId` thay vì `settingName`
  const [categories, setCategories] = useState([]); // State lưu danh sách danh mục

  // Gọi API để lấy danh sách danh mục shop
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await Product_Services.Product_Category(6); // Gọi API lấy danh mục
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSaveShop = async () => {
    if (!shopName || !shopAddress || !settingId) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }

    const userId = await Account_Service.getUserIdFromToken(); // Lấy userId từ token/localStorage

    const newShop = {
      shopName,
      shopAddress,
      settingId: parseInt(settingId, 10), // Đảm bảo `settingId` là số nguyên
      isActive: "true", // API yêu cầu kiểu String cho `isActive`
      rating: 0,
      userId: userId,
    };

    try {
      const response = await Shop_Services.createShop(newShop);
      Swal.fire("Thành công!", "Shop của bạn đã được tạo!", "success");
      handleClose();
      onShopCreated(); // Gọi callback khi shop đã được tạo
    } catch (error) {
      console.error("Lỗi khi tạo shop:", error);
      Swal.fire("Lỗi", "Không thể tạo shop. Vui lòng thử lại!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đăng ký Shop</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Tên Shop *" margin="normal" value={shopName} onChange={(e) => setShopName(e.target.value)} />
        <TextField fullWidth label="Địa chỉ Shop *" margin="normal" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục Shop *</InputLabel>
          <Select value={settingId} onChange={(e) => setSettingId(e.target.value)}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.settingId} value={category.settingId}>
                  {category.settingName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có danh mục nào</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSaveShop} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShopModal;
