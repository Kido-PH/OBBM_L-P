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
import { initialEvents } from "../components/data";

const EventManager = () => {
  const [events, setEvents] = useState(initialEvents);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    EventId: null,
    EventName: "",
    Description: "",
    TotalCost: 0,
    IsDeleted: false,
    Status: false,
  });
  const [dialogMode, setDialogMode] = useState("add"); // 'add', 'edit'
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Mở dialog thêm/sửa sự kiện
  const handleOpenDialog = (mode, event) => {
    setDialogMode(mode);
    setCurrentEvent(
      event || {
        EventId: null,
        EventName: "",
        Description: "",
        TotalCost: 0,
        IsDeleted: false,
        Status: false,
      }
    );
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Lưu sự kiện mới hoặc chỉnh sửa sự kiện
  const handleSave = () => {
    if (dialogMode === "add") {
      setEvents([...events, { ...currentEvent, EventId: events.length + 1 }]);
      toast.success("Thêm sự kiện thành công!");
    } else if (dialogMode === "edit") {
      setEvents(
        events.map((event) =>
          event.EventId === currentEvent.EventId ? currentEvent : event
        )
      );
      toast.success("Chỉnh sửa sự kiện thành công!");
    }
    handleCloseDialog();
  };

  // Xử lý click "Delete" để cập nhật trạng thái "Status" và ẩn sự kiện
  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setEvents(
      events.map((event) =>
        event.EventId === eventToDelete ? { ...event, Status: true } : event
      )
    );
    setOpenConfirmDialog(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setEventToDelete(null);
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
          label="Search Event"
          variant="outlined"
          sx={{ width: "300px" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add Event
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event ID</TableCell>
              <TableCell>Event Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>TotalCost</TableCell>
              <TableCell>IsDeleted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .filter((event) => !event.Status) // Chỉ hiển thị sự kiện không bị xóa tạm thời
              .map((event) => (
                <TableRow key={event.EventId}>
                  <TableCell>{event.EventId}</TableCell>
                  <TableCell>{event.EventName}</TableCell>
                  <TableCell>{event.Description}</TableCell>
                  <TableCell>{event.TotalCost}</TableCell>
                  <TableCell
                    className={`${
                      event.IsDeleted === true ? "text-danger" : "text-success"
                    }`}
                  >
                    {event.IsDeleted === true
                      ? "Ngưng hoạt động"
                      : "Đang hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", event)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(event.EventId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm/sửa sự kiện */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Thêm sự kiện" : "Chỉnh sửa sự kiện"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="EventName"
            label="Tên sự kiện"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.EventName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Description"
            label="Mô tả"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.Description || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="TotalCost"
            label="Tổng chi phí"
            type="number"
            fullWidth
            variant="outlined"
            value={currentEvent.TotalCost || 0}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="IsDeleted"
              value={currentEvent.IsDeleted}
              onChange={handleInputChange}
              label="Trạng thái"
            >
              <MenuItem value={false}>Active</MenuItem>
              <MenuItem value={true}>IsDeleted</MenuItem>
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

      {/* Dialog xác nhận xóa */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa sự kiện này không?</p>
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

export default EventManager;
