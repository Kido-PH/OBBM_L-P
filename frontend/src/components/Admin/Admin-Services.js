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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import { toast, Toaster } from "react-hot-toast";
import serviceApi from "../../api/serviceApi";
import ReactPaginate from "react-paginate";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentService, setCurrentService] = useState({
    serviceId: null,
    name: "",
    type: "",
    price: 0,
    description: "",
    status: true,
  });
  const [dialogMode, setDialogMode] = useState("add"); // 'add', 'edit'
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const SIZE_SERVICE = 5;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [errors, setErrors] = useState({});

  const handleOpenDialog = (mode, event) => {
    setDialogMode(mode);
    if (event) event.image = "";
    setCurrentService(
      event || {
        serviceId: null,
        name: "",
        type: "",
        price: 0,
        image: "",
        description: "",
        status: true,
      }
    );
    setOpenDialog(true);
  };

  // Tìm và nạp Danh mục khi thành phần gắn liên kết
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxOTExNjUyOTg0LCJpYXQiOjE3MzE2NTI5ODQsImp0aSI6ImE1YTM4YjY2LTAxMzYtNDc3ZC04MmY5LWFmYjZjZjFlMDFkNCIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.a2UHLzg_NYYv6IW2HihiGqAHERE0ulix1pMeALQPttb-j-syYQfu53Rha5S6rZG6z11Brcgbgzcj_qvxAi8fCA";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    fetchDichVuWithPaginate(page); // Lấy trang đầu tiên
  }, [page]);

  // Hàm đổ dữ liệu & phân trang
  const fetchDichVuWithPaginate = async (page) => {
    try {
      const res = await serviceApi.getPaginate(page, SIZE_SERVICE);
      setServices(res.result?.content);
      setPageCount(res.result?.totalPages);
      console.log("res.dt = ", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được dịch vụ: ", error);
    }
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

      setCurrentService({
        ...currentService,
        image: imagePreviewUrl,
      });

      // Xóa lỗi nếu người dùng chọn ảnh
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: undefined,
      }));
    } else {
      // Xử lý các trường khác
      setCurrentService({
        ...currentService,
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

    if (!currentService.name || currentService.name.trim() === "") {
      newErrors.name = "Tên dịch vụ không được để trống.";
    }

    if (!currentService.type || currentService.type.trim() === "") {
      newErrors.type = "Loại dịch vụ không được để trống.";
    }

    if (!currentService.price || currentService.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0.";
    }

    // if (!currentService.description || currentService.description.trim() === "") {
    //   newErrors.description = "Mô tả là bắt buộc.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Kiểm tra lỗi trước khi lưu
    if (!validate()) {
      return;
    }

    if (dialogMode === "add") {
      delete currentService.serviceId;
      const res = await serviceApi.add(currentService);
      if (res.code === 1000) {
        fetchDichVuWithPaginate(page);
        toast.success("Thêm dịch vụ thành công !");
      }
    } else if (dialogMode === "edit") {
      const { name, type, price, image, description, status } = currentService;
      const res = await serviceApi.update(currentService.serviceId, {
        name,
        type,
        price,
        image,
        description,
        status,
      });
      if (res.code === 1000) {
        fetchDichVuWithPaginate(page);
        toast.success("Cập nhật dịch vụ thành công !");
      }
    }
    handleCloseDialog();
  };

  // Xử lý click "Delete" để cập nhật trạng thái "Status" và ẩn dịch vụ
  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    const res = await serviceApi.delete(serviceToDelete);
    if (res.code === 1000) {
      fetchDichVuWithPaginate(page);
      toast.success("Dịch vụ đã được xóa thành công !");
    }
    setOpenConfirmDialog(false);
    setServiceToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setServiceToDelete(null);
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1; // Lấy số trang người dùng chọn
    setPage(selectedPage); // Cập nhật page
    console.log(`User requested page number ${event.selected}`);
  };

  const filteredServices = services
    .filter((event) => !event.Status) // Loại bỏ các sự kiện có `Status` là true
    .filter((event) => {
      if (searchTerm === "") return true; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      if (!isNaN(searchTerm)) {
        // Nếu nhập số, lọc theo serviceId
        return String(services.serviceId).includes(searchTerm);
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
          mt: 3,
          mb: 2,
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

        {/* Nút Add New Service */}
        <Button
          sx={{ fontSize: "10px" }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          <AddIcon
            sx={{
              marginRight: "5px",
              fontSize: "16px",
              verticalAlign: "middle",
            }}
          />
          Thêm dịch vụ
        </Button>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Loại dịch vụ</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices
              .filter((event) => !event.Status)
              .map((service, index) => (
                <TableRow key={service.serviceId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.type}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      currencyDisplay: "code",
                    }).format(service.price)}
                  </TableCell>
                  <TableCell>
                    <img
                      src={`${service.image}`}
                      alt={service.name}
                      width="70"                      
                    />
                  </TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>
                    <IconButton
                      size="large"
                      color="primary"
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", service)}
                      style={{ marginRight: "10px" }}
                    >
                      <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Sửa</span>}
                        placement="top"
                      >
                        <EditIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      size="large"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(service.serviceId)}
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
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight: "bold" }}
        >
          {dialogMode === "add" ? "Thêm dịch vụ" : "Chỉnh sửa dịch vụ"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên dịch vụ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentService.name || ""}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="type"
            label="Loại dịch vụ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentService.type || ""}
            onChange={handleInputChange}
            error={!!errors.type}
            helperText={errors.type}
          />
          <TextField
            margin="dense"
            name="price"
            label="Giá"
            type="number"
            fullWidth
            variant="outlined"
            value={currentService.price || 0}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />

          {currentService.image && (
            <img
              src={currentService.image}
              alt="Dịch vụ"
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

          <TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentService.description || ""}
            onChange={handleInputChange}
          />
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
          <p>Bạn chắc chắn muốn xóa dịch vụ này ?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="secondary"
            sx={{ fontSize: "1.3rem" }}
          >
            Đóng
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            sx={{ fontSize: "1.3rem" }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceManager;
