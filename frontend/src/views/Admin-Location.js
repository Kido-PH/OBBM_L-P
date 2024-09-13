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
      toast.success("Thêm địa điểm thành công!");
    } else if (dialogMode === "edit") {
      setLocations(
        locations.map((location) =>
          location.LocationId === currentLocation.LocationId
            ? currentLocation
            : location
        )
      );
      toast.success("Chỉnh sửa địa điểm thành công!");
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
          label="Search Location"
          variant="outlined"
          sx={{ width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add Location
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
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
            {locations
              .filter((location) => !location.Status)
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
                    className={`${
                      location.IsDeleted === true
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {location.IsDeleted === true
                      ? "Ngưng hoạt động"
                      : "Đang hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", location)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(location.LocationId)}
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
          {dialogMode === "add" ? "Add Location" : "Edit Location"}
        </DialogTitle>
        <DialogContent>
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
          <p>Bạn có đồng ý xóa địa điểm này không?</p>
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

export default LocationManager;
