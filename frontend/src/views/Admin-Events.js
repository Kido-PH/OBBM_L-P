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
  IconButton,
  Typography,
  Divider,
  TablePagination,
} from "@mui/material";
import { toast } from "react-toastify";
import { initialEvents } from "../components/data";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang

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
      toast.success("Event add successfully !");
    } else if (dialogMode === "edit") {
      setEvents(
        events.map((event) =>
          event.EventId === currentEvent.EventId ? currentEvent : event
        )
      );
      toast.success("Edit event successful !");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  // Hàm tìm kiếm: Lọc các dịch vụ dựa trên từ khóa tìm kiếm
  const filteredEvents = events
    .filter((events) =>
      searchTerm === "" || // Nếu không có từ khóa tìm kiếm
      Object.values(events).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((events) => !events.Status); // Loại bỏ các dịch vụ có trạng thái 'Status' là true

  return (
    <div>
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage Event
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Event"
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
          Add Event
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }} className="table-container">
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
            {filteredEvents
              .filter((event) => !event.Status) // Chỉ hiển thị sự kiện không bị xóa tạm thời
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Chỉ lấy các mục cho trang hiện tại
              .map((event) => (
                <TableRow key={event.EventId}>
                  <TableCell>{event.EventId}</TableCell>
                  <TableCell>{event.EventName}</TableCell>
                  <TableCell>{event.Description}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      currencyDisplay: "code",
                    }).format(event.TotalCost)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: event.IsDeleted ? "red" : "green",
                      alignItems: "center",
                    }}
                  >
                    {event.IsDeleted ? (
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
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", event)}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(event.EventId)}
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
          count={events.length}
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

      {/* Dialog thêm/sửa sự kiện */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight:'bold' }}>
          {dialogMode === "add" ? "Add Events" : "Edit Event"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="EventName"
            label="EventName"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.EventName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.Description || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="TotalCost"
            label="TotalCost"
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
          <Button onClick={handleCloseDialog} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle sx={{fontSize:'1.6rem', color: '#d32f2f', display: 'flex', alignItems: 'center'}}>
            <ErrorOutlineIcon sx={{ color: 'error.main', mr: 1 }} />
            Delete confirmation
        </DialogTitle>
        <DialogContent>
          <p>Do you agree to delete this event ?</p>
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

export default EventManager;
