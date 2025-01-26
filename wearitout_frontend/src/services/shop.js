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



 

const Shop_Services = {
   
        Get_All_Shop,
    
}
export default Shop_Services;