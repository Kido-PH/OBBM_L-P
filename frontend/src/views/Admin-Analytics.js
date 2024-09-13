import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  // Data giả lập cho biểu đồ
  const revenueData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [15000000, 20000000, 30000000, 25000000, 40000000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const contractData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Số lượng hợp đồng",
        data: [10, 15, 20, 12, 25],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const serviceUsageData = {
    labels: ["Dịch vụ A", "Dịch vụ B", "Dịch vụ C"],
    datasets: [
      {
        label: "Sử dụng dịch vụ",
        data: [30, 20, 50],
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
      },
    ],
  };
  const materialData = {
    labels: ["Nguyên liệu A", "Nguyên liệu B", "Nguyên liệu C"],
    datasets: [
      {
        label: "Sử dụng nguyên liệu",
        data: [120, 200, 150],
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const eventData = {
    labels: ["Sự kiện A", "Sự kiện B", "Sự kiện C"],
    datasets: [
      {
        label: "Số lượng sự kiện tổ chức",
        data: [5, 10, 7],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Thống kê doanh thu và hoạt động
      </Typography>

      <Grid container spacing={2}>
        {/* Doanh thu */}
        <Grid item md={4}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Doanh thu hàng tháng
            </Typography>
            <Box sx={{ width: "100%", height: "200px" }}>
              <Bar
                data={revenueData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Số lượng hợp đồng */}
        <Grid item md={4}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Số lượng hợp đồng theo tháng
            </Typography>
            <Box sx={{ width: "100%", height: "200px" }}>
              <Line
                data={contractData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Tình hình sử dụng dịch vụ */}
        <Grid item md={4}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Tình hình sử dụng dịch vụ
            </Typography>
            <Box sx={{ width: "100%", height: "200px" }}>
              <Pie
                data={serviceUsageData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item md={4}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Sử dụng nguyên liệu
            </Typography>
            <Box sx={{ width: "100%", height: "200px" }}>
              <Bar
                data={materialData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item md={4}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Số lượng sự kiện tổ chức
            </Typography>
            <Box sx={{ width: "100%", height: "200px" }}>
              <Pie data={eventData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;