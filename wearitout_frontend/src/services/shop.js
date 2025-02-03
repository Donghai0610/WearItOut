import Account_Service from "./account";
import axiosInstance from "./axios";


const Get_All_Shop = async ()=>{
    try {
        const response = await axiosInstance.get(`/api/v1/product/shops`,{ noAuth: true });
        return response.data; 
    } catch (error) {
        console.error('Error fetching all shop:', error);
        throw error;
    }
};

const Get_Product_By_Shop_Id_User_Id = async ({ 
    productName = '', 
    price = null, 
    setting = '', 
    page = 0, 
    size = 10, 
    sortDirection = 'asc', 
    sortBy = 'price' 
  }) => {
    try {
      const userId = Account_Service.getUserIdFromToken();
      if (!userId) throw new Error("User ID không tồn tại.");
  
      const response = await axiosInstance.get('/api/v1/product/products-by-user-id', {
        params: {
          userId,
          productName,
          price,
          setting,
          page,
          size,
          sortDirection,
          sortBy
        },
      });
  
      return response.data; // Trả về dữ liệu sản phẩm
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const Get_Shops_By_User = async () => {
    try {
        // Lấy userId từ token
        const userId = await Account_Service.getUserIdFromToken();
        if (!userId) {
            throw new Error("Không tìm thấy userId từ token!");
        }

        // Gọi API lấy danh sách shop theo userId
        const response = await axiosInstance.get(`/api/v1/shop/search/${userId}?page=0&size=10`);
        
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
        throw error;
    }
};


const Shop_Services = {
   
        Get_All_Shop,
        Get_Product_By_Shop_Id_User_Id ,
        Get_Shops_By_User
    
}
export default Shop_Services;