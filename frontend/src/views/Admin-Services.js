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
} from "@mui/material";
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
      toast.success("Thêm dịch vụ thành công!");
    } else if (dialogMode === "edit") {
      setServices(
        services.map((service) =>
          service.ServiceId === currentService.ServiceId
            ? currentService
            : service
        )
      );
      toast.success("Chỉnh sửa thành công !");
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
          label="Search Service"
          variant="outlined"
          sx={{ width: "300px" }}
        />

        {/* Nút Add New Contract nằm bên phải */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add New Service
        </Button>
      </Box>

      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("add")}
      >
        Add Service
      </Button> */}

      <TableContainer component={Paper}>
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
            {services
              .filter((service) => !service.Status)
              .map((service) => (
                <TableRow key={service.ServiceId}>
                  <TableCell>{service.ServiceId}</TableCell>
                  <TableCell>{service.ServiceName}</TableCell>
                  <TableCell>{service.Description}</TableCell>
                  <TableCell>{service.ServiceType}</TableCell>
                  <TableCell>{service.Availability ? "Yes" : "No"}</TableCell>
                  <TableCell>{service.Price}</TableCell>
                  <TableCell
                    className={`${
                      service.IsDeleted === true
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {service.IsDeleted === true
                      ? "Ngưng hoạt động"
                      : "Đang hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", service)}
                      style={{ marginRight: "10px" }} 
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(service.ServiceId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Add Service" : "Edit Service"}
        </DialogTitle>
        <DialogContent>
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
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có đồng ý xóa dịch vụ này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Không
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceManager;