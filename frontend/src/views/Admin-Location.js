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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Divider,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { toast } from "react-toastify";
import { initialLocations } from "../components/data";

const LocationManager = () => {
  const [locations, setLocations] = useState(initialLocations);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    LocationId: null,
    LocationName: "",
    Address: "",
    LocationType: "",
    Capacity: 0,
    TableNumber: 0,
    RentCost: 0,
    Description: "",
    IsDeleted: false,
    Status: false,
  });
  const [dialogMode, setDialogMode] = useState("add");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang

  const handleOpenDialog = (mode, location) => {
    setDialogMode(mode);
    setCurrentLocation(
      location || {
        LocationId: null,
        LocationName: "",
        Address: "",
        LocationType: "",
        Capacity: 0,
        TableNumber: 0,
        RentCost: 0,
        Description: "",
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
    setCurrentLocation({
      ...currentLocation,
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
      setLocations([
        ...locations,
        { ...currentLocation, LocationId: locations.length + 1 },
      ]);
      toast.success("Location add successfully !");
    } else if (dialogMode === "edit") {
      setLocations(
        locations.map((location) =>
          location.LocationId === currentLocation.LocationId
            ? currentLocation
            : location
        )
      );
      toast.success("Edit location successful !");
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (locationId) => {
    setLocationToDelete(locationId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setLocations(
      locations.map((location) =>
        location.LocationId === locationToDelete
          ? { ...location, Status: true }
          : location
      )
    );
    setOpenConfirmDialog(false);
    setLocationToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setLocationToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

    // Hàm tìm kiếm: Lọc các dịch vụ dựa trên từ khóa tìm kiếm
    const filteredLocations = locations
    .filter((locations) =>
      searchTerm === "" || // Nếu không có từ khóa tìm kiếm
      Object.values(locations).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((locations) => !locations.Status); // Loại bỏ các dịch vụ có trạng thái 'Status' là true

  return (
    <div>
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage Location
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt:2,
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Location"
          variant="outlined"
          sx={{ width: "300px" }}
          value={searchTerm} // Liên kết với searchTerm
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng nhập liệu
        />
        <Button
          sx={{fontSize:'10px'}}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add Location
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Location Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Location Type</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Table Number</TableCell>
              <TableCell>Rent Cost</TableCell>
              <TableCell>IsDeleted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLocations
              .filter((location) => !location.Status)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Chỉ lấy các mục cho trang hiện tại
              .map((location) => (
                <TableRow key={location.LocationId}>
                  <TableCell>{location.LocationId}</TableCell>
                  <TableCell>{location.LocationName}</TableCell>
                  <TableCell>{location.Address}</TableCell>
                  <TableCell>{location.LocationType}</TableCell>
                  <TableCell>{location.Capacity}</TableCell>
                  <TableCell>{location.TableNumber}</TableCell>
                  <TableCell>{location.RentCost}</TableCell>
                  <TableCell
                    sx={{
                      color: location.IsDeleted ? "red" : "green",
                      alignItems: "center",
                    }}
                  >
                    {location.IsDeleted ? (
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
                      onClick={() => handleOpenDialog("edit", location)}
                      style={{ marginRight: "10px" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="large"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(location.LocationId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={locations.length}
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
          {dialogMode === "add" ? "Add Location" : "Edit Location"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="LocationName"
            label="Location Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.LocationName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.Address || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="LocationType"
            label="Location Type"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.LocationType || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.Capacity || 0}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="TableNumber"
            label="Table Number"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.TableNumber || 0}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="RentCost"
            label="Rent Cost"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.RentCost || 0}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.Description || ""}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>IsDeleted</InputLabel>
            <Select
              name="IsDeleted"
              value={currentLocation.IsDeleted}
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
          <p>Do you agree to delete this location ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" sx={{fontSize:'1.3rem'}}>
            Close
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" sx={{fontSize:'1.3rem'}}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LocationManager;