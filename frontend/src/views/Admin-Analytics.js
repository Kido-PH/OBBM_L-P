import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
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
import * as XLSX from "xlsx";
import { toast } from 'react-toastify'; // Import the react-toastify library for notifications

// Registering the chart components
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
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [groupBy, setGroupBy] = useState("month"); // State for grouping option
  const [selectedKPI, setSelectedKPI] = useState("revenue"); // State for selected KPI
  const [totalRevenue, setTotalRevenue] = useState(0); // Total revenue for notification
  
  // Effect to show notification when revenue exceeds 50 million VND
  useEffect(() => {
    if (totalRevenue > 50000000) {
      toast.success("Congratulations! Revenue exceeded the target!");
    }
  }, [totalRevenue]);

  // Simulated data for the chart, can be replaced with real API data
  const revenueData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Revenue (VND)",
        data: [15000000, 20000000, 30000000, 25000000, 40000000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Number of Contracts",
        data: [12, 15, 22, 19, 25],
        type: "line", // Line chart for number of contracts
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  // Simulated revenue forecast data
  const forecastData = {
    labels: ["June", "July", "August", "September", "October"],
    datasets: [
      {
        label: "Revenue Forecast (VND)",
        data: [45000000, 48000000, 50000000, 53000000, 55000000],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  // Export revenue data to CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      revenueData.datasets[0].data.map((value, index) => ({
        Month: revenueData.labels[index],
        Revenue: value,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue");
    XLSX.writeFile(workbook, "revenue.xlsx");
  };

  const handleDateFilter = () => {
    console.log(`Filtering from: ${startDate} to: ${endDate}`);
  };

  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value); // Update the grouping option
  };

  const handleKPIChange = (e) => {
    setSelectedKPI(e.target.value); // Update the selected KPI
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Revenue and Activity Statistics
      </Typography>

      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="From Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="To Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          select
          label="Group By"
          value={groupBy}
          onChange={handleGroupByChange}
          SelectProps={{ native: true }}
          sx={{ marginRight: 2 }}
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="week">Week</option> {/* Option to group by week */}
          <option value="year">Year</option> {/* Option to group by year */}
        </TextField>
        <TextField
          select
          label="Select KPI"
          value={selectedKPI}
          onChange={handleKPIChange}
          SelectProps={{ native: true }}
          sx={{ marginRight: 2 }}
        >
          <option value="revenue">Revenue</option>
          <option value="contracts">Contracts</option>
          <option value="profit">Profit</option> {/* Select profit KPI */}
        </TextField>
        <Button variant="contained" onClick={handleDateFilter}>
          Filter
        </Button>
        <Button variant="contained" onClick={exportToCSV} sx={{ marginLeft: 2 }}>
          Export Data
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Revenue and contracts */}
        <Grid item md={6}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Monthly Revenue and Contracts
            </Typography>
            <Box sx={{ width: "100%", height: "300px" }}>
              <Bar
                data={revenueData}
                options={{
                  maintainAspectRatio: false,
                  onClick: (e, element) => {
                    if (element.length) {
                      const index = element[0].index;
                      alert(
                        `Revenue details for ${revenueData.labels[index]}: ${revenueData.datasets[0].data[index]}`
                      );
                    }
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Revenue forecast */}
        <Grid item md={6}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Revenue Forecast
            </Typography>
            <Box sx={{ width: "100%", height: "300px" }}>
              <Line data={forecastData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Dynamic KPIs */}
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography>Highest Revenue</Typography>
              <Typography variant="h5">40,000,000 VND</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography>Highest Number of Contracts</Typography>
              <Typography variant="h5">25 Contracts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography>Most Used Service</Typography>
              <Typography variant="h5">Service C</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
