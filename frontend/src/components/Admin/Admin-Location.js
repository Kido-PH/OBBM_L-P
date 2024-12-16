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
  Tooltip,
  Grid,
  TablePagination,
  Tabs,
  Tab,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import locationApi from "../../api/locationApi";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../../api/userApi";
import { Typography } from "antd";
import SnackBarNotification from "./SnackBarNotification";

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    name: "",
    type: "",
    address: "",
    capacity: 0,
    table: 0,
    cost: 0,
    description: "",
    status: "",
    image: "",
  });
  const [locationId, setLocationId] = useState("");
  const [dialogMode, setDialogMode] = useState("add");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0); // 0: Admin, 1: Customer

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("success");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  useEffect(() => {
    fetchDanhMucWithPaginate(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab); // Cập nhật tab đang chọn
    filterLocations(newTab, searchTerm); // Lọc lại dữ liệu khi chuyển tab
  };

  useEffect(() => {
    filterLocations(activeTab, searchTerm); // Lọc lại khi đổi tab hoặc tìm kiếm
  }, [locations, activeTab, searchTerm]);

  const filterLocations = (tab, searchTerm) => {
    let filtered = locations;

    // Lọc theo tab đang chọn: 0 cho Admin, 1 cho Customer
    if (tab === 0) {
      filtered = locations.filter((location) => !location.isCustom); // Admin tạo địa điểm
    } else {
      filtered = locations.filter((location) => location.isCustom); // Customer tạo địa điểm
    }

    // Tiến hành lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          location.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  };
  const [hasPermission, setHasPermission] = useState(false);
  const [hasPermission2, setHasPermission2] = useState(false);
  const [hasPermission3, setHasPermission3] = useState(false);
  const userPermissions = localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles")).permissions
    : [];

  // Hàm kiểm tra quyền
  const checkPermission = (permissionName) => {
    return userPermissions.some(
      (permission) => permission.name === permissionName
    );
  };

  // Kiểm tra quyền CREATE_EVENT khi component mount
  useEffect(() => {
    const permissionGranted = checkPermission("CREATE_LOCATION");
    const permissionGranted2 = checkPermission("DELETE_LOCATION");
    const permissionGranted3 = checkPermission("UPDATE_LOCATION");
    setHasPermission(permissionGranted);
    setHasPermission2(permissionGranted2);
    setHasPermission3(permissionGranted3);
  }, []); // Chạy 1 lần khi component mount
  const fetchDanhMucWithPaginate = async (page, rowsPerPage) => {
    try {
      const resLocation = await locationApi.getPaginate(page, rowsPerPage);
      const locations = resLocation.result?.content || [];

      setLocations(locations);
      console.log("Dữ liệu địa điểm: ", resLocation);

      setTotalElements(resLocation.result?.totalElements);
    } catch (error) {
      console.error("Lỗi khi nạp dữ liệu:", error);
      toast.error("Không thể nạp dữ liệu!");
    }
  };

  const handleOpenDialog = (mode, location = null) => {
    setDialogMode(mode);
    setCurrentLocation(
      location || {
        name: "",
        type: "",
        address: "",
        capacity: 0,
        table: 0,
        cost: 0,
        description: "",
        status: "",
      }
    );
    setLocationId(location?.locationId || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = async (e) => {
    const { type, name, value, files } = e.target;

    // Xử lý ảnh
    if (name === "image" && files && files.length > 0) {
      const file = files[0];

      // Tạo URL tạm thời cho ảnh (preview)
      const imagePreviewUrl = URL.createObjectURL(file);

      // Cập nhật ảnh vào state để hiển thị preview
      setCurrentLocation({
        ...currentLocation,
        image: imagePreviewUrl,
      });

      try {
        // Tạo FormData để gửi file
        const formData = new FormData();
        formData.append("file", file);

        // Gửi yêu cầu lên API để tải ảnh lên
        const response = await fetch(
          "http://localhost:8080/obbm/upload/image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData, // Đưa formData vào body
          }
        );

        const data = await response.json();
        console.log("Response Data:", data);
        if (response.ok) {
          console.log("Upload thành công:", data);
          // Lấy URL từ API Cloudinary
          const imageUrl = data.result; // Kết quả trả về là URL của ảnh đã được upload
          setCurrentLocation({
            ...currentLocation,
            image: imageUrl,
          });
          // Xóa lỗi nếu người dùng chọn ảnh
          setErrors((prevErrors) => ({
            ...prevErrors,
            image: undefined,
          }));
        } else {
          console.error("Lỗi tải ảnh:", data);
          setErrors((prevErrors) => ({
            ...prevErrors,
            image: "Không thể tải ảnh lên",
          }));
        }
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Không thể tải ảnh lên",
        }));
      }
    } else {
      // Xử lý các trường khác
      setCurrentLocation({
        ...currentLocation,
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

  // Bắt lỗi
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra các trường bắt buộc
    if (!currentLocation.name || currentLocation.name.trim() === "") {
      newErrors.name = "Tên địa điểm không được để trống";
    }
    if (!currentLocation.type || currentLocation.type.trim() === "") {
      newErrors.type = "Loại địa điểm không được để trống";
    }
    if (!currentLocation.address || currentLocation.address.trim() === "") {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const addLocation = async () => {
    try {
      // Chuẩn bị dữ liệu cho request
      const diaDiemMoi = {
        name: currentLocation.name,
        type: currentLocation.type,
        address: currentLocation.address,
        capacity: Number(currentLocation.capacity),
        table: Number(currentLocation.table),
        cost: Number(currentLocation.cost),
        description: currentLocation.description,
        status: currentLocation.status,
        image: currentLocation.image,
      };

      // Gọi API POST để thêm địa điểm mới
      const response = await locationApi.add(diaDiemMoi);
      const newLocation = response?.result;

      if (newLocation) {
        // Bổ sung thông tin người tạo vào newLocation
        const locationWithCreator = {
          ...newLocation,
          creatorName: "Admin",
          creatorRole: "ADMIN",
        };

        // Cập nhật danh sách địa điểm trong state
        setLocations((prevLocations) => [
          locationWithCreator,
          ...prevLocations,
        ]);

        // Lấy danh sách hiện tại từ LocalStorage
        const savedLocations =
          JSON.parse(localStorage.getItem("locations")) || [];

        // Thêm địa điểm mới vào danh sách
        savedLocations.unshift(locationWithCreator);

        showSuccess("Địa điểm mới được thêm thành công!");
      } else {
        toast.error("Không nhận được phản hồi từ API.");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi thêm địa điểm:", error);
      toast.error("Không thể thêm địa điểm. Vui lòng thử lại sau!");
    }
  };

  // Hàm chuyển đổi blob thành base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      // Kiểm tra xem dữ liệu có phải là Blob không
      if (blob && blob instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Trả về base64
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Đọc blob dưới dạng base64
      } else {
        reject("Không phải Blob");
      }
    });
  };

  const updateLocation = async () => {
    try {
      if (!locationId) {
        toast.error("Không tìm thấy ID của địa điểm cần cập nhật!");
        return;
      }

      // Kiểm tra form
      if (!validateForm()) {
        toast.error("Vui lòng kiểm tra lại các trường dữ liệu!");
        return;
      }

      // Kiểm tra nếu image là Blob và chuyển đổi nó thành base64
      let base64Image = currentLocation.image;
      if (currentLocation.image instanceof Blob) {
        base64Image = await convertBlobToBase64(currentLocation.image);
      }

      const data = {
        name: currentLocation.name,
        type: currentLocation.type,
        address: currentLocation.address,
        capacity: Number(currentLocation.capacity),
        table: Number(currentLocation.table),
        cost: Number(currentLocation.cost),
        description: currentLocation.description,
        status: currentLocation.status,
        image: base64Image,
      };

      console.log("Dữ liệu cập nhật:", data);

      // Gọi API để cập nhật địa điểm (không kiểm tra phản hồi)
      await locationApi.update(locationId, data);

      // Hiển thị thông báo thành công
      showSuccess("Địa điểm đã được cập nhật thành công!");

      // Cập nhật danh sách địa điểm trong state mà không cần tải lại trang
      setLocations((prevLocations) =>
        prevLocations.map((location) =>
          location.locationId === locationId
            ? { ...location, ...data }
            : location
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi gọi API update:", error);
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
      }
      toast.error("Không thể cập nhật địa điểm. Vui lòng thử lại sau!");
    }
  };

  const handleDeleteClick = (locationId) => {
    setLocationToDelete(locationId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!locationToDelete) {
        toast.error("Không tìm thấy ID của địa điểm cần xóa!");
        return;
      }

      // Gọi API để xóa địa điểm
      await locationApi.delete(locationToDelete);

      // Cập nhật state sau khi xóa thành công
      setLocations((prevLocations) =>
        prevLocations.filter(
          (location) => location.locationId !== locationToDelete
        )
      );

      showSuccess("Địa điểm đã được xóa thành công!");

      // Đóng dialog và reset state
      setOpenConfirmDialog(false);
      setLocationToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa địa điểm:", error);
      toast.error("Không thể xóa địa điểm. Vui lòng thử lại sau!");
    }
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
    setPage(0);
  };

  // Hàm tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRemoveImage = () => {
    setCurrentLocation((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#1976d2", // Màu của đường kẻ dưới tab
            },
          }}
          sx={{
            borderBottom: "1px solid #ddd", // Thêm đường kẻ dưới tất cả các tab
          }}
        >
          <Tab
            label="QUẢN LÝ"
            style={{ fontSize: "11px", fontWeight: "bold" }}
          />
          <Tab
            label="KHÁCH HÀNG"
            style={{ fontSize: "11px", fontWeight: "bold" }}
          />
        </Tabs>
      </Box>
      <SnackBarNotification
        open={snackBarOpen}
        handleClose={handleCloseSnackBar}
        message={snackBarMessage}
        snackType={snackType}
      />
      <Box>
        <div className="admin-toolbar" style={{ marginTop: "12px" }}>
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
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {hasPermission && activeTab === 0 && (
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
              Thêm địa điểm
            </Button>
          )}
        </div>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLocations.map((location, index) => (
              <TableRow key={location.locationId}>
                <TableCell>{index + 1}</TableCell>

                <Tooltip title={<span style={{ fontSize: "13px", fontWeight: "bold" }}>{location.name}</span>} arrow placement="top">
                    <TableCell 
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: "250px",
                          }}
                      >{location.name}</TableCell>
                  </Tooltip>
                <TableCell>
                  <img src={location.image} alt={location.name} width="70" />
                </TableCell>
                <TableCell>{location.type}</TableCell>

                <Tooltip title={<span style={{ fontSize: "13px", fontWeight: "bold" }}>{location.address}</span>} arrow placement="top">
                    <TableCell 
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: "250px",
                          }}
                      >{location.address}</TableCell>
                  </Tooltip>

                <TableCell>
                  {location.capacity
                    ? `${location.capacity} người`
                    : "Không xác định"}
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {hasPermission3 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog("edit", location)}
                    >
                      <Tooltip
                        title={
                          <span style={{ fontSize: "1.25rem" }}>
                            Sửa địa điểm
                          </span>
                        }
                        placement="top"
                      >
                        <EditIcon />
                      </Tooltip>
                    </Button>
                  )}
                  {hasPermission2 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(location.locationId)}
                    >
                      <Tooltip
                        title={
                          <span style={{ fontSize: "1.25rem" }}>
                            Xóa địa điểm
                          </span>
                        }
                        placement="top"
                      >
                        <DeleteIcon />
                      </Tooltip>
                    </Button>
                  )}
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

      {/* Dialog thêm và sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontSize: "1.7rem" }}>
          {dialogMode === "add" ? "Thêm địa điểm" : "Chỉnh sửa địa điểm"}
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Tên địa điểm
              </label>
              <TextField
                margin="dense"
                name="name"
                type="text"
                placeholder="Tên địa điểm"
                fullWidth
                variant="outlined"
                value={currentLocation.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={activeTab === 1}
              />
            </Grid>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Loại địa điểm
              </label>
              <TextField
                margin="dense"
                name="type"
                type="text"
                placeholder="Loại địa điểm"
                fullWidth
                variant="outlined"
                value={currentLocation.type}
                onChange={handleInputChange}
                error={!!errors.type}
                helperText={errors.type}
                disabled={activeTab === 1}
              />
            </Grid>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Địa chỉ
              </label>
              <TextField
                margin="dense"
                name="address"
                placeholder="Địa chỉ"
                type="text"
                fullWidth
                variant="outlined"
                value={currentLocation.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Sức chứa
              </label>
              <TextField
                margin="dense"
                name="capacity"
                placeholder="Sức chứa"
                type="number"
                fullWidth
                variant="outlined"
                value={currentLocation.capacity}
                onChange={handleInputChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
            </Grid>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Bàn
              </label>
              <TextField
                margin="dense"
                name="table"
                placeholder="Bàn"
                type="number"
                fullWidth
                variant="outlined"
                value={currentLocation.table}
                onChange={handleInputChange}
                error={!!errors.table}
                helperText={errors.table}
              />
            </Grid>
            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Chi phí
              </label>
              <TextField
                margin="dense"
                name="cost"
                type="text"
                fullWidth
                variant="outlined"
                value={new Intl.NumberFormat("vi-VN").format(
                  currentLocation?.cost
                )}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\./g, ""); // Loại bỏ tất cả dấu chấm
                  if (rawValue === "") {
                    setCurrentLocation({
                      ...currentLocation,
                      cost: 0, // Nếu xóa hết giá trị, gán về 0
                    });
                  } else if (!isNaN(rawValue)) {
                    // Nếu giá trị hợp lệ, lưu vào state mà không có dấu chấm
                    setCurrentLocation({
                      ...currentLocation,
                      cost: parseInt(rawValue, 10), // Chuyển thành số nguyên
                    });
                  }
                }}
                error={!!errors.cost}
                helperText={errors.cost}
              />
            </Grid>

            <Grid item xs={6}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Trạng thái
              </label>
              <FormControl
                fullWidth
                margin="dense"
                variant="outlined"
                sx={{ height: "100%" }}
              >
                <Select
                  labelId="status-label"
                  name="status"
                  value={currentLocation.status || ""}
                  onChange={handleInputChange}
                  error={!!errors.status}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "#3f51b5",
                      fontSize: "2rem",
                    },
                    minHeight: "3.6em",
                  }}
                >
                  <MenuItem value="Chờ kiểm duyệt">Chờ kiểm duyệt</MenuItem>
                  <MenuItem value="Đã kiểm duyệt">Đã kiểm duyệt</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  padding: "1em",
                  marginBottom: "1em",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "center",
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                {currentLocation.image ? (
                  <Box
                    component="img"
                    src={currentLocation.image}
                    alt="Dịch vụ"
                    sx={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <>
                    <AddAPhotoIcon
                      sx={{ fontSize: 48, color: "#aaa", mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      Nhấn để chọn ảnh
                    </Typography>
                  </>
                )}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                {currentLocation.image && (
                  <Button
                    variant="contained"
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#c82333",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                Mô tả
              </label>
              <TextField
                margin="dense"
                name="description"
                placeholder="Mô tả"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                minRows={3}
                maxRows={5}
                value={currentLocation.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            HỦY
          </Button>
          <Button
            onClick={dialogMode === "add" ? addLocation : updateLocation}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            LƯU
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
          Xác nhận xóa địa điểm
        </DialogTitle>
        <DialogContent>
          <p>Bạn chắc chắn muốn xóa địa điểm này ?</p>
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
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LocationManager;
