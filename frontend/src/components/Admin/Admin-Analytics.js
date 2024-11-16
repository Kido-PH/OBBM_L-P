import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Button,
  Modal,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import WarningIcon from "@mui/icons-material/Warning";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LaptopIcon from "@mui/icons-material/Laptop";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon cho nút Xác nhận
import LogoutIcon from "@mui/icons-material/Logout"; // Icon cho nút Đăng xuất

// Đăng ký các thành phần của biểu đồ
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState("thisMonth");
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  // Dữ liệu mẫu cho từng tab
  const dailyRevenueData = {
    labels: ["01", "02", "03", "04", "05", "06", "07"],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [3000000, 2500000, 4000000, 3500000, 4200000, 5000000, 6000000],
        backgroundColor: "rgba(0, 123, 255, 0.8)", // Màu xanh nước biển
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
        barThickness: 50, // Điều chỉnh độ rộng của cột
      },
      {
        label: "Số lượng hợp đồng",
        data: [3, 5, 6, 4, 7, 8, 5],
        type: "line",
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  };

  const hourlyRevenueData = {
    labels: ["8:00", "10:00", "11:00", "12:00", "13:00"], // Theo các giờ trong ngày
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [500000, 800000, 1000000, 750000, 900000],
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
        barThickness: 50, // Điều chỉnh độ rộng của cột
      },
      {
        label: "Số lượng hợp đồng",
        data: [1, 2, 3, 2, 3],
        type: "line",
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  };

  const weeklyRevenueData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], // Theo các thứ trong tuần
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [
          10000000, 15000000, 12000000, 18000000, 16000000, 17000000, 20000000,
        ],
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
        barThickness: 50, // Điều chỉnh độ rộng của cột
      },
      {
        label: "Số lượng hợp đồng",
        data: [10, 12, 15, 17, 13, 18, 20],
        type: "line",
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  };

  // Chọn dữ liệu dựa trên tab đang chọn
  const revenueData =
    activeTab === 0
      ? dailyRevenueData
      : activeTab === 1
      ? hourlyRevenueData
      : weeklyRevenueData;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container spacing={2} sx={{ minHeight: "100vh" }}>
      {/* Cột bên trái - Phần biểu đồ và dashboard */}
      <Grid item xs={9}>
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "16px", fontWeight: "bold", color: "#333" }}
          >
            THỐNG KÊ KẾT QUẢ HỢP ĐỒNG
          </Typography>

          <Grid container spacing={2}>
            {/* Thẻ tổng kết */}
            <Grid item md={4}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: 1,
                }}
              >
                <CardContent
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm đổ bóng
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    Tổng doanh thu
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {Math.max(...revenueData.datasets[0].data).toLocaleString()}{" "}
                    VND
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={4}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: 1,
                }}
              >
                <CardContent
                  sx={{
                    backgroundColor: "#fce4ec", // Màu hồng nhạt
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm đổ bóng
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    Hợp đồng đang chờ duyệt
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {Math.max(...revenueData.datasets[1].data)} hợp đồng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={4}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: 1,
                }}
              >
                <CardContent
                  sx={{
                    backgroundColor: "#d1e7dd", // Màu xanh nhạt
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm đổ bóng
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    Hợp đồng đã hủy
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    0 hợp đồng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Biểu đồ doanh thu và các tab */}
          <Box
            sx={{
              marginTop: "20px",
              position: "relative",
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: "10px", fontWeight: "bold" }}
            >
              Doanh thu thuần tháng này
            </Typography>

            {/* Combobox chọn thời gian */}
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                minWidth: 150,
              }}
            >
              <Select
                value={selectedTimeRange}
                onChange={handleTimeRangeChange}
                displayEmpty
                inputProps={{ "aria-label": "Chọn khoảng thời gian" }}
                sx={{ fontSize: "1.2rem" }}
              >
                <MenuItem value="today" sx={{ fontSize: "1.2rem" }}>
                  Hôm nay
                </MenuItem>
                <MenuItem value="yesterday" sx={{ fontSize: "1.2rem" }}>
                  Hôm qua
                </MenuItem>
                <MenuItem value="last7days" sx={{ fontSize: "1.2rem" }}>
                  7 ngày qua
                </MenuItem>
                <MenuItem value="thisMonth" sx={{ fontSize: "1.2rem" }}>
                  Tháng này
                </MenuItem>
                <MenuItem value="lastMonth" sx={{ fontSize: "1.2rem" }}>
                  Tháng trước
                </MenuItem>
              </Select>
            </FormControl>

            {/* Tabs cho từng khoảng thời gian */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{ marginBottom: "10px" }}
            >
              <Tab label="Theo ngày" sx={{ fontSize: "1rem" }} />
              <Tab label="Theo giờ" sx={{ fontSize: "1rem" }} />
              <Tab label="Theo thứ" sx={{ fontSize: "1rem" }} />
            </Tabs>

            <Box sx={{ width: "100%", height: "350px" }}>
              <Bar
                data={revenueData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  onClick: (e, element) => {
                    if (element.length) {
                      const index = element[0].index;
                      alert(
                        `Chi tiết doanh thu cho ${
                          revenueData.labels[index]
                        }: ${revenueData.datasets[0].data[
                          index
                        ].toLocaleString()} VND`
                      );
                    }
                  },
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${
                            context.dataset.label
                          }: ${context.raw.toLocaleString()} VND`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false, // Tắt đường kẻ dọc
                      },
                      ticks: {
                        color: "#333", // Màu của text trên trục X
                        font: {
                          size: 14,
                          weight: "bold", // Đặt font chữ đậm cho trục X
                        },
                      },
                      border: {
                        display: true,
                        color: "#333", // Màu đậm cho trục X
                        width: 1, // Độ dày của trục X
                      },
                    },
                    y: {
                      grid: {
                        color: "#e0e0e0", // Màu của đường kẻ ngang (nếu muốn tùy chỉnh)
                      },
                      ticks: {
                        color: "#333", // Màu của text trên trục Y
                        font: {
                          size: 14,
                          weight: "bold", // Đặt font chữ đậm cho trục Y
                        },
                      },
                      border: {
                        display: true,
                        color: "#333", // Màu đậm cho trục Y
                        width: 1, // Độ dày của trục Y
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Cột bên phải - Phần thông báo */}
      <Grid item xs={3}>
        <Box
          sx={{
            padding: "20px",
            maxHeight: "90vh",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: 1,
          }}
        >
          {/* Tiêu đề Thông báo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "16px",
              fontSize: "1.2rem",
            }}
          >
            THÔNG BÁO
          </Typography>

          {/* Thông báo đăng nhập bất thường */}
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
          >
            <WarningIcon
              sx={{ color: "#d32f2f", marginRight: "8px", fontSize: "1.5rem" }}
            />
            <Typography
              sx={{ fontWeight: "bold", color: "#d32f2f", fontSize: "1.25rem" }}
            >
              Có 11 hoạt động đăng nhập khác thường cần kiểm tra.
            </Typography>
          </Box>

          {/* Các hoạt động đăng nhập bất thường */}
          <Box sx={{ marginBottom: "16px" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              NGOCNGA đã đăng nhập trên Máy tính Windows vào 24/10/2024 08:49
            </Typography>
            <Button
              onClick={handleOpenModal}
              sx={{
                color: "#1976d2",
                textTransform: "none",
                fontSize: "1.25rem",
              }}
            >
              Kiểm tra
            </Button>

            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              HAIDANG đã đăng nhập trên SM-A217N vào 17/10/2024 16:53
            </Typography>
            <Button
              onClick={handleOpenModal}
              sx={{
                color: "#1976d2",
                textTransform: "none",
                fontSize: "1.25rem",
              }}
            >
              Kiểm tra
            </Button>
          </Box>
          <hr />
          <br />
          {/* Tiêu đề Hoạt động gần đây */}
          <Typography
            variant="h6"
            sx={{
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            CÁC HOẠT ĐỘNG GẦN ĐÂY
          </Typography>

          {/* Danh sách các hoạt động */}
          <Box
            sx={{
              borderLeft: "2px solid #e0e0e0",
              paddingLeft: "16px",
              position: "relative",
              maxHeight: "300px", // Đặt chiều cao tối đa cho danh sách
              overflowY: "auto", // Bật thanh cuộn dọc
            }}
          >
            {/* Hoạt động nhập hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e0f7fa",
                  color: "#009688",
                  marginRight: "8px",
                }}
              >
                <MoveToInboxIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Nguyễn Thị Thái Hòa</strong> vừa nhập hàng với giá trị{" "}
                  <strong>0</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>

            {/* Hoạt động bán hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  marginRight: "8px",
                }}
              >
                <ShoppingCartIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Nguyễn Thị Thái Hòa</strong> vừa bán đơn hàng với giá
                  trị <strong>7.594.000</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>

            {/* Hoạt động nhập hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e0f7fa",
                  color: "#009688",
                  marginRight: "8px",
                }}
              >
                <MoveToInboxIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Nguyễn Văn A</strong> vừa nhập hàng với giá trị{" "}
                  <strong>10.000.000</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>

            {/* Hoạt động bán hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  marginRight: "8px",
                }}
              >
                <ShoppingCartIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Nguyễn Văn A</strong> vừa bán đơn hàng với giá trị{" "}
                  <strong>7.594.000</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>

            {/* Hoạt động nhập hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e0f7fa",
                  color: "#009688",
                  marginRight: "8px",
                }}
              >
                <MoveToInboxIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Trần Văn C</strong> vừa nhập hàng với giá trị{" "}
                  <strong>5.000.000</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>

            {/* Hoạt động bán hàng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  marginRight: "8px",
                }}
              >
                <ShoppingCartIcon fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  <strong>Trần Văn C</strong> vừa bán đơn hàng với giá trị{" "}
                  <strong>7.594.000</strong>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: "1rem" }}
                >
                  14 phút trước
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Modal hiển thị chi tiết đăng nhập bất thường */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                maxWidth: 500,
                margin: "100px auto",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: 24,
                position: "relative",
              }}
            >
              {/* Nút đóng modal (dấu X) */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "#000",
                }}
              >
                <CloseIcon />
              </IconButton>

              <Typography
                id="modal-title"
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: "1.3rem",
                }}
              >
                Kiểm tra hoạt động đăng nhập
              </Typography>
              <Typography
                id="modal-description"
                sx={{ marginBottom: "20px", fontSize: "1.25rem" }}
              >
                Chúng tôi nhận thấy một lượt đăng nhập mới vào gian hàng từ
                thiết bị lạ. Bạn có nhận ra hoạt động này?
              </Typography>

              {/* Thông tin đăng nhập */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <LaptopIcon sx={{ fontSize: "40px", marginRight: "10px" }} />
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
                  >
                    0394920946
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "1.25rem" }}>
                    Máy tính Windows
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: "1.25rem" }}
                  >
                    07/11/2024 22:32
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: "1.25rem" }}
                  >
                    Chrome
                  </Typography>
                </Box>
              </Box>

              {/* Nút hành động */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCloseModal}
                  sx={{
                    fontSize: "0.95rem",
                    backgroundColor: "#4CAF50",
                    padding: "6px 16px",
                    marginLeft: "220px",
                  }}
                  startIcon={<CheckCircleIcon />}
                >
                  Xác nhận
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal}
                  sx={{ fontSize: "0.95rem", padding: "6px 16px" }}
                  startIcon={<LogoutIcon />}
                >
                  Đăng xuất
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminAnalytics;
