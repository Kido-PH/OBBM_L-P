import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { initialContracts } from "../components/data";
import { toast } from "react-toastify";
import { Divider } from "antd";
import {} from "date-fns";

const ManageContracts = () => {
  const [contracts, setContracts] = useState(initialContracts); // Dữ liệu hợp đồng
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [filterPaymentStatus, setFilterPaymentStatus] = useState(""); // Trạng thái lọc PaymentStatus
  const [filterContractType, setFilterContractType] = useState(""); // Trạng thái lọc ContractType
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang
  const [formData, setFormData] = useState({
    ContractId: "",
    Username: "",
    EventId: "",
    OrganizDate: "",
    LocationId: "",
    ContractType: "",
    TotalMoney: "",
    PaymentStatus: "",
    ContractStatus: "",
    Description: "",
    CustomerName: "",
    CustomerPhone: "",
    CustomerEmail: "",
    IsDeleted: false,
    IsConfirmed: false, // Thêm trường này
  });

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelContractId, setCancelContractId] = useState(null); // Lưu ID hợp đồng cần hủy

  // Hiển thị modal chỉnh sửa
  const handleShowModal = (contract) => {
    setFormData(contract);
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lưu hợp đồng sau khi chỉnh sửa
  const handleSave = () => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === formData.ContractId ? formData : contract
      )
    );
    toast.success("Edit contract successful !");
    setShowModal(false); // Đóng modal sau khi lưu
  };

  const handleCancelConfirmation = (ContractId) => {
    setCancelContractId(ContractId); // Lưu lại ID của hợp đồng cần hủy
    setConfirmCancel(true); // Hiển thị hộp thoại xác nhận
  };

  // Hủy hợp đồng bằng cách cập nhật trạng thái
  const handleCancel = () => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === cancelContractId
          ? { ...contract, ContractStatus: "Cancelled" }
          : contract
      )
    );
    setConfirmCancel(false); // Đóng hộp thoại xác nhận
    toast.success("The contract has been canceled");
  };
  const handleConfirm = (ContractId) => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === ContractId
          ? { ...contract, IsConfirmed: true, ContractStatus: "Completed" }
          : contract
      )
    );
    toast.success("The contract has been confirmed");
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  return (
    <div className="contentContracts">
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage Contracts
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {/* Tìm kiếm và lọc */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm */}
        <TextField
          label="Search Contract"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px" }}
        />

        {/* Bộ lọc theo PaymentStatus */}
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            label="Payment Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>

        {/* Bộ lọc theo ContractType */}
        <FormControl sx={{ width: "200px", mr: 58 }}>
          <InputLabel>Contract Type</InputLabel>
          <Select
            value={filterContractType}
            onChange={(e) => setFilterContractType(e.target.value)}
            label="Contract Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Rental">Rental</MenuItem>
            <MenuItem value="Consulting">Consulting</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>EventId</TableCell>
              <TableCell>OrganizDate</TableCell>
              <TableCell>LocationId</TableCell>
              <TableCell>ContractType</TableCell>
              <TableCell>TotalMoney</TableCell>
              <TableCell>PaymentStatus</TableCell>
              <TableCell>ContractStatus</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {/* Nội dung contracts */}
          <TableBody>
            {contracts
              .filter((contract) => {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                return (
                  (contract.Username.toLowerCase().includes(
                    lowerCaseSearchTerm
                  ) ||
                    (typeof contract.EventId === "number" &&
                      contract.EventId.toString().includes(
                        lowerCaseSearchTerm
                      )) ||
                    (typeof contract.LocationId === "string"
                      ? contract.LocationId.toLowerCase()
                      : contract.LocationId.toString()
                    ).includes(lowerCaseSearchTerm) ||
                    contract.ContractType.toLowerCase().includes(
                      lowerCaseSearchTerm
                    ) ||
                    contract.PaymentStatus.toLowerCase().includes(
                      lowerCaseSearchTerm
                    ) ||
                    contract.ContractStatus.toLowerCase().includes(
                      lowerCaseSearchTerm
                    ) ||
                    contract.Description.toLowerCase().includes(
                      lowerCaseSearchTerm
                    ) ||
                    contract.CustomerName.toLowerCase().includes(
                      lowerCaseSearchTerm
                    ) ||
                    (typeof contract.CustomerPhone === "string"
                      ? contract.CustomerPhone
                      : contract.CustomerPhone.toString()
                    ).includes(lowerCaseSearchTerm) ||
                    contract.CustomerEmail.toLowerCase().includes(
                      lowerCaseSearchTerm
                    )) &&
                  (filterPaymentStatus === "" ||
                    contract.PaymentStatus === filterPaymentStatus) &&
                  (filterContractType === "" ||
                    contract.ContractType === filterContractType)
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Chỉ lấy các mục cho trang hiện tại
              .map((contract, index) => (
                <TableRow key={contract.ContractId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{contract.Username}</TableCell>
                  <TableCell>{contract.EventId}</TableCell>
                  <TableCell>
                    {new Date(contract.OrganizDate).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                    {new Date(contract.OrganizDate).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>{contract.LocationId}</TableCell>
                  <TableCell>{contract.ContractType}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      currencyDisplay: "code",
                    }).format(contract.TotalMoney)}
                  </TableCell>
                  <TableCell>{contract.PaymentStatus}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        contract.ContractStatus === "Cancelled"
                          ? "red"
                          : contract.ContractStatus === "Completed"
                          ? "green"
                          : contract.ContractStatus === "Active"
                          ? "#b28900"
                          : contract.ContractStatus === "Confirmed"
                          ? "blue"
                          : "default",
                    }}
                  >
                    {contract.ContractStatus}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px", // Limit the width
                      overflow: "hidden", // Hide overflowing text
                      whiteSpace: "nowrap", // Prevent text from wrapping
                      textOverflow: "ellipsis", // Show ellipsis for truncated text
                      "&:hover": {
                        overflow: "auto", // Enable scroll on hover
                      },
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "120px",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "150px",
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          scrollbarWidth: "thin", // Firefox - make scrollbar thin
                        }}
                      >
                        {contract.Description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleShowModal(contract)}
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleConfirm(contract.ContractId)}
                      sx={{
                        justifyContent: "center",
                      }}
                      disabled={
                        contract.ContractStatus === "Pending" ||
                        contract.ContractStatus === "Completed" ||
                        contract.PaymentStatus === "Pending"
                      } // Disable based on contract status
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleCancelConfirmation(contract.ContractId)
                      }
                      sx={{
                        justifyContent: "center",
                      }}
                      disabled={
                        contract.ContractStatus === "Pending" ||
                        contract.PaymentStatus === "Pending"
                      } // Disable if contract is pending
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contracts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "1.2rem",
            padding: "16px",
            color: "#333", // Đổi màu chữ thành màu tối hơn
            backgroundColor: "#f9f9f9", // Thêm màu nền nhạt
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Thêm shadow để làm nổi bật
            borderRadius: "8px", // Thêm bo góc
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "1.2rem",
              },
            "& .MuiTablePagination-actions > button": {
              fontSize: "1.2rem",
              margin: "0 8px", // Thêm khoảng cách giữa các nút
              backgroundColor: "#1976d2", // Màu nền của các nút
              color: "#fff", // Màu chữ của các nút
              borderRadius: "50%", // Nút bấm hình tròn
              padding: "8px", // Tăng kích thước nút
              transition: "background-color 0.3s", // Hiệu ứng hover
              "&:hover": {
                backgroundColor: "#1565c0", // Đổi màu khi hover
              },
            },
          }}
        />
      </TableContainer>
      {/* Modal chỉnh sửa hợp đồng */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle
          sx={{ fontSize: "1.6rem", color: "#FFA500", fontWeight: "bold" }}
        >
          Edit Contract
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            label="Username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="EventId"
            name="EventId"
            type="number"
            value={formData.EventId}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="OrganizDate"
            name="OrganizDate"
            type="datetime-local"
            value={formData.OrganizDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="LocationId"
            name="LocationId"
            value={formData.LocationId}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="ContractType"
            name="ContractType"
            value={formData.ContractType}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="TotalMoney"
            name="TotalMoney"
            type="number"
            value={formData.TotalMoney}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="PaymentStatus"
            name="PaymentStatus"
            value={formData.PaymentStatus}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Contract Status</InputLabel>
            <Select
              label="Contract Status"
              name="ContractStatus"
              value={formData.ContractStatus}
              onChange={handleChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerName"
            name="CustomerName"
            value={formData.CustomerName}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerPhone"
            name="CustomerPhone"
            value={formData.CustomerPhone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerEmail"
            name="CustomerEmail"
            type="email"
            value={formData.CustomerEmail}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>{" "}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ color: "error.main", mr: 1 }} />
          Cancel Contract
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1.6rem" }}>
            Are you sure you want to cancel this contract?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmCancel(false)}
            color="secondary"
            sx={{ fontSize: "1.5rem" }}
          >
            Close
          </Button>
          <Button
            onClick={handleCancel}
            color="primary"
            sx={{ fontSize: "1.5rem" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageContracts;
