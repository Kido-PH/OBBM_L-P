import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  TablePagination,
  Typography,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { initialServices } from "../components/data";
import { toast } from "react-toastify";

const ServiceManager = () => {
  const [services, setServices] = useState(initialServices);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentService, setCurrentService] = useState({
    ServiceId: null,
    ServiceName: "",
    Description: "",
    ServiceType: "",
    Availability: true,
    Price: 0,
    IsDeleted: false,
    Status: false,
  });
  const [dialogMode, setDialogMode] = useState("add"); // 'add', 'edit'
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang

  const handleOpenDialog = (mode, service) => {
    setDialogMode(mode);
    setCurrentService(
      service || {
        ServiceId: null,
        ServiceName: "",
        Description: "",
        ServiceType: "",
        Availability: true,
        Price: 0,
        IsDeleted: false,
        Status: false,
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentService({
      ...currentService,
      [name]:
        name === "IsDeleted"
          ? value === "true"
          : type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      setServices([
        ...services,
        { ...currentService, ServiceId: services.length + 1 },
      ]);
      toast.success("Service add successfully !");
    } else if (dialogMode === "edit") {
      setServices(
        services.map((service) =>
          service.ServiceId === currentService.ServiceId
            ? currentService
            : service
        )
      );
      toast.success("Edit service successful !");
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setServices(
      services.map((service) =>
        service.ServiceId === serviceToDelete
          ? { ...service, Status: true }
          : service
      )
    );
    setOpenConfirmDialog(false);
    setServiceToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setServiceToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  // Hàm tìm kiếm: Lọc các dịch vụ dựa trên từ khóa tìm kiếm
  const filteredServices = services
    .filter((service) =>
      searchTerm === "" || // Nếu không có từ khóa tìm kiếm
      Object.values(service).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((service) => !service.Status); // Loại bỏ các dịch vụ có trạng thái 'Status' là true

  return (
    <div>
     <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage Service
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3, 
          mb: 2,
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Service"
          variant="outlined"
          sx={{ width: "300px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
        />

        {/* Nút Add New Contract */}
        <Button
          sx={{fontSize:'10px'}}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add New Service
        </Button>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Service Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>IsDeleted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Chỉ lấy các mục cho trang hiện tại
              .map((service) => (
                <TableRow key={service.ServiceId}>
                  <TableCell>{service.ServiceId}</TableCell>
                  <TableCell>{service.ServiceName}</TableCell>
                  <TableCell>{service.Description}</TableCell>
                  <TableCell>{service.ServiceType}</TableCell>
                  <TableCell>{service.Availability ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      currencyDisplay: "code",
                    }).format(service.Price)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: service.IsDeleted ? "red" : "green",
                      alignItems: "center",
                    }}
                  >
                    {service.IsDeleted ? (
                      <>
                        <CancelIcon sx={{ color: "red" }} />{" "}
                        <span>Inactive</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />{" "}
                        <span>Active</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="large"
                      color="primary"
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", service)}
                      style={{ marginRight: "10px" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="large"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(service.ServiceId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={services.length}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight:'bold' }}>
          {dialogMode === "add" ? "Add Service" : "Edit Service"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="ServiceName"
            label="Service Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentService.ServiceName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={currentService.Description || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="ServiceType"
            label="Service Type"
            type="text"
            fullWidth
            variant="outlined"
            value={currentService.ServiceType || ""}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentService.Availability || false}
                onChange={handleInputChange}
                name="Availability"
              />
            }
            label="Available"
          />
          <TextField
            margin="dense"
            name="Price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={currentService.Price || 0}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>IsDeleted</InputLabel>
            <Select
              name="IsDeleted"
              value={currentService.IsDeleted}
              onChange={handleInputChange}
              label="IsDeleted"
            >
              <MenuItem value="true">Deleted</MenuItem>
              <MenuItem value="false">Active</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle sx={{fontSize:'1.6rem', color: '#d32f2f', display: 'flex', alignItems: 'center'}}>
            <ErrorOutlineIcon sx={{ color: 'error.main', mr: 1 }} />
            Delete confirmation
        </DialogTitle>
        <DialogContent>
          <p>Do you agree to delete this service?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary" sx={{fontSize:'1.3rem'}}> 
            Close
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" sx={{fontSize:'1.3rem'}}> 
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceManager;