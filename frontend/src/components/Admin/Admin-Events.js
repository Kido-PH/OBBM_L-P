import React, { useState, useEffect } from "react";
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
  Box,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast, Toaster } from "react-hot-toast";
import eventsApi from "../../api/eventsApi";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    eventId: null,
    name: "",
    totalcost: 0,
    description: "",
    image: "",
  });
  const [dialogMode, setDialogMode] = useState("add"); // 'add', 'edit'
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang
  const [totalElements, setTotalElements] = useState(0);
  const [errors, setErrors] = useState({});

  // Tìm và nạp Danh mục khi thành phần gắn liên kết
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzQxMzgxNDIyLCJpYXQiOjE3MzEzODE0MjIsImp0aSI6ImE1MWRhY2Q0LTAxZDgtNDYyNy1hMmY0LWUzMTIyZjNmMTNjOCIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.ET7C8_3BVsTz6viUJxSPcU3LTOOPfBDin3X82dlIykfMy-6jZEcZRhOUjfFskt6KXU5_vpdrxFHrp1OPl9LsnA";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    fetchEventsWithPaginate(page + 1); // Lấy trang đầu tiên
  }, [page, rowsPerPage]);

  const fetchEventsWithPaginate = async (page) => {
    try {
      const res = await eventsApi.getPaginate(page, rowsPerPage);
      setEvents(res.result?.content);
      setTotalElements(res.result?.totalElements);
      console.log("res.dt = ", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  // Mở dialog thêm/sửa sự kiện
  const handleOpenDialog = (mode, event) => {
    setDialogMode(mode);
    // khi event có giá trị ==> api cập nhật cần thuộc tính image, mà api lấy danh sách events ko có nên phải set thêm vào
    if (event) event.image = "";
    setCurrentEvent(
      event || {
        eventId: null,
        name: "",
        totalcost: 0,
        description: "",
        image: "",
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
    const { type, name, value, files } = e.target;

    // Xử lý ảnh
    if (name === "image" && files && files.length > 0) {
      const file = files[0];

      // Tạo URL tạm thời cho ảnh (preview)
      const imagePreviewUrl = URL.createObjectURL(file);

      setCurrentEvent({
        ...currentEvent,
        image: imagePreviewUrl,
      });

      // Xóa lỗi nếu người dùng chọn ảnh
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: undefined,
      }));
    } else {
      // Xử lý các trường khác
      setCurrentEvent({
        ...currentEvent,
        [name]: type === "number" ? Number(value) : value,
      });

      // Xóa lỗi nếu người dùng nhập đúng
      if (value.trim() !== "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: undefined,
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!currentEvent.name || currentEvent.name.trim() === "") {
      newErrors.name = "Tên sự kiện không được bỏ trống.";
    }

    if (!currentEvent.description || currentEvent.description.trim() === "") {
      newErrors.description = "Mô tả không được bỏ trống.";
    }

    if (!currentEvent.totalcost || currentEvent.totalcost <= 0) {
      newErrors.totalcost = "Tổng chi phí phải lớn hơn 0.";
    }

    // Kiểm tra ảnh (nếu cần)
    // if (!currentEvent.image) {
    //   newErrors.image = "Hình ảnh là bắt buộc.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lưu sự kiện mới hoặc chỉnh sửa sự kiện
  const handleSave = async () => {
    // Kiểm tra lỗi trước khi lưu
    if (!validate()) {
      return;
    }

    if (dialogMode === "add") {
      delete currentEvent.eventId;
      const res = await eventsApi.add(currentEvent);
      if (res.code === 1000) {
        fetchEventsWithPaginate(page + 1);
        toast.success("Thêm sự kiện thành công !");
      }
    } else if (dialogMode === "edit") {
      const { name, totalcost, description, image } = currentEvent;
      const res = await eventsApi.update(currentEvent.eventId, {
        name,
        totalcost,
        description,
        image,
      });
      if (res.code === 1000) {
        fetchEventsWithPaginate(page + 1);
        toast.success("Sự kiện đã được cập nhật thành công !");
      }
    }
    handleCloseDialog();
  };

  // Xử lý click "Delete" để cập nhật trạng thái "Status" và ẩn sự kiện
  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    const res = await eventsApi.delete(eventToDelete);
    if (res.code === 1000) {
      fetchEventsWithPaginate(page + 1);
      toast.success("Sự kiện đã được xóa thành công !");
    }
    setOpenConfirmDialog(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setEventToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    console.log("check page: ", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  const filteredEvents = events
    .filter((event) => !event.Status) // Loại bỏ các sự kiện có `Status` là true
    .filter((event) => {
      if (searchTerm === "") return true; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      if (!isNaN(searchTerm)) {
        // Nếu nhập số, lọc theo eventId
        return String(event.eventId).includes(searchTerm);
      }
      // Nếu nhập ký tự, lọc theo các trường khác (ví dụ: name)
      return event.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm */}
        <div className="admin-group">
          <svg
            className="admin-icon-search"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Tìm kiếm"
            type="search"
            className="admin-input-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          sx={{ fontSize: "10px" }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add", null)}
        >
          <AddIcon
            sx={{
              marginRight: "5px",
              fontSize: "16px",
              verticalAlign: "middle",
            }}
          />
          Thêm sự kiện
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mt: 1 }}
        className="table-container"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên sự kiện</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Tổng chi phí</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents
              .filter((event) => !event.Status) // Chỉ hiển thị sự kiện không bị xóa tạm thời
              .map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell>{event.eventId}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      currencyDisplay: "code",
                    }).format(event.totalcost)}
                  </TableCell>
                  <TableCell>
                    <img
                      src={`${event.image}`}
                      alt={event.name}
                      width="70"
                      height="70"
                      style={{
                        objectFit: "cover",
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                      }} // Thêm objectFit và borderRadius
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", event)}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Sửa</span>}
                        placement="top"
                      >
                        <EditIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(event.eventId)}
                    >
                      <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Xóa</span>}
                        placement="top"
                      >
                        <DeleteIcon />
                      </Tooltip>
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
          count={totalElements}
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
        <DialogTitle
          sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight: "bold" }}
        >
          {dialogMode === "add" ? "Thêm sự kiện" : "Sửa sự kiện"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên sự kiện"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.name || ""}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.description || ""}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            name="totalcost"
            label="Tổng chi phí"
            type="number"
            fullWidth
            variant="outlined"
            value={currentEvent.totalcost || 0}
            onChange={handleInputChange}
            error={!!errors.totalcost}
            helperText={errors.totalcost}
          />
          {currentEvent.image && (
            <img
              src={currentEvent.image}
              alt="Sự kiện"
              style={{ width: "100%", height: "250px", marginBottom: "1em" }}
            />
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" sx={{ mb: "5px" }}>
              <AddAPhotoIcon sx={{ mr: "5px" }} />
              Chọn ảnh
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ color: "error.main", mr: 1 }} />
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa sự kiện này ?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            sx={{ fontSize: "1.3rem" }}
          >
            Đóng
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            sx={{ fontSize: "1.3rem" }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventManager;
