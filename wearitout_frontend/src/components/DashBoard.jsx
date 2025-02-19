import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    // Dữ liệu cho biểu đồ 1: Thống kê doanh số theo danh mục sản phẩm
    const salesData = [
        { name: "Thời trang", value: 400 },
        { name: "Điện tử", value: 300 },
        { name: "Gia dụng", value: 200 },
        { name: "Sách", value: 100 },
    ];

    // Dữ liệu cho biểu đồ 2: Tỉ lệ đơn hàng theo trạng thái
    const orderStatusData = [
        { name: "Chờ xử lý", value: 10 },
        { name: "Đang giao", value: 5 },
        { name: "Hoàn thành", value: 20 },
        { name: "Đã hủy", value: 2 },
    ];

    // Màu sắc cho biểu đồ
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap" }}>
                {/* Biểu đồ 1: Doanh số theo danh mục sản phẩm */}
                <div style={{ width: "40%", height: "300px" }}>
                    <h3>Doanh số theo danh mục</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={salesData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ 2: Tỉ lệ đơn hàng theo trạng thái */}
                <div style={{ width: "40%", height: "300px" }}>
                    <h3>Tình trạng đơn hàng</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#82ca9d"
                                dataKey="value"
                                label
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
