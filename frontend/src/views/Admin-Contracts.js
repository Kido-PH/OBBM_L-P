
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
} from "@mui/material";
import { initialContracts } from "../components/data";
import { toast } from "react-toastify";

const ManageContracts = () => {
  const [contracts, setContracts] = useState(initialContracts); // Dữ liệu hợp đồng
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [setCurrentContract] = useState(null); // Hợp đồng hiện tại
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
    // setCurrentContract(contract);
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
    toast.success("Chỉnh sửa thành công");
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
    toast.success("Hợp đồng đã bị hủy");
  };
  const handleConfirm = (ContractId) => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === ContractId
          ? { ...contract, IsConfirmed: true, ContractStatus: "Completed" }
          : contract
      )
    );
    toast.success("Hợp đồng đã được xác nhận");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Contract"
          variant="outlined"
          sx={{ width: "300px" }}
        />
      </Box>
      <TableContainer component={Paper}>
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
          <TableBody>
            {contracts.map((contract, index) => (
              <TableRow key={contract.ContractId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contract.Username}</TableCell>
                <TableCell>{contract.EventId}</TableCell>
                <TableCell>{contract.OrganizDate}</TableCell>
                <TableCell>{contract.LocationId}</TableCell>
                <TableCell>{contract.ContractType}</TableCell>
                <TableCell>{contract.TotalMoney}</TableCell>
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
                        ? "blue" // Màu cho trạng thái đã xác nhận
                        : "default",
                  }}
                >
                  {contract.ContractStatus}
                </TableCell>

                <TableCell>{contract.Description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleShowModal(contract)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  {contract.ContractStatus !== "Completed" ? (
                    <>
                      {" "}
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleConfirm(contract.ContractId)}
                        sx={{ mr: 1 }}
                      >
                        Xác Nhận
                      </Button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Button
                        variant="outlined"
                        color="success"
                        sx={{ mr: 1 }}
                        disabled
                      >
                        Xác Nhận
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      handleCancelConfirmation(contract.ContractId)
                    }
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal chỉnh sửa hợp đồng */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Contract</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>{" "}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle>Xác nhận hủy hợp đồng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn hủy hợp đồng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleCancel} color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageContracts;