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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import locationApi from "../../api/locationApi";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../../api/userApi";

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
  const SIZE_LOCATION = 5;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzQxNDE5MzczLCJpYXQiOjE3MzE0MTkzNzMsImp0aSI6IjUwMDNjYjVkLWU0NjItNDY2OS05YWFjLTVlMzljMTM0MDE0MCIsInNjb3BlIjoiUk9MRV9BRE1JTiBFRElUX0NPTlRSQUNUIENSRUFURV9DT05UUkFDVCBWSUVXX0NPTlRSQUNUIEVESVRfTUVOVSBDUkVBVEVfTUVOVSBWSUVXX01FTlUifQ.PcGhO85pvvcFouDgdAWqcCxYFXbzYxBs_Hl84s0YkCKnnY-1Rp5tIz6Y0g11KmENWbSKrWJRaFHmXNgJVleWhA";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    fetchDanhMucWithPaginate(page); // Lấy trang đầu tiên
  }, [page]);

  const fetchDanhMucWithPaginate = async (page) => {
    try {
      const resLocation = await locationApi.getPaginate(page, SIZE_LOCATION);
      const locations = resLocation.result?.content || [];

      // Gọi API để lấy danh sách người dùng
      const resUsers = await userApi.getAll();
      const users = resUsers.result || [];

      // Tạo một map để đối chiếu userId với thông tin người dùng
      const userMap = new Map();
      users.forEach((user) => {
        const role = user.roles?.[0]?.name || "User";
        userMap.set(user.userId, {
          fullname: user.fullname || "Unknown",
          role,
        });
      });

      // Cập nhật thông tin người tạo cho từng địa điểm
      const updatedLocations = locations.map((location) => {
        const userId = location.users?.userId;
        const isCustom = location.isCustom;

        // Nếu `isCustom` là `false`, địa điểm được tạo bởi Admin
        if (!isCustom) {
          return {
            ...location,
            creatorName: "Admin",
            creatorRole: "ADMIN",
          };
        }

        // Lấy thông tin người tạo từ `userMap` nếu là người dùng thông thường
        const user = userMap.get(userId) || {};
        return {
          ...location,
          creatorName: user.fullname || "Unknown",
          creatorRole: user.role || "User",
        };
      });

      setLocations(updatedLocations);
      setPageCount(resLocation.result?.totalPages);
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

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    // Cập nhật dữ liệu món ăn
    if (name === "image" && files) {
      setCurrentLocation((prevState) => ({
        ...prevState,
        image: URL.createObjectURL(files[0]),
      }));
    } else {
      setCurrentLocation((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Xóa thông báo lỗi nếu dữ liệu nhập vào hợp lệ
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Kiểm tra từng trường và xóa lỗi nếu dữ liệu hợp lệ
      if (name === "name" && value.trim() !== "") {
        delete newErrors.name;
      }
      if (name === "type" && value.trim() !== "") {
        delete newErrors.type;
      }
      if (name === "address" && value.trim() !== "") {
        delete newErrors.address;
      }
      if (name === "capacity" && !isNaN(value) && Number(value) > 0) {
        delete newErrors.capacity;
      }
      if (name === "table" && !isNaN(value) && Number(value) > 0) {
        delete newErrors.table;
      }
      if (name === "cost" && !isNaN(value) && Number(value) > 0) {
        delete newErrors.cost;
      }
      if (name === "description" && value.trim() !== "") {
        delete newErrors.description;
      }
      if (name === "status" && value.trim() !== "") {
        delete newErrors.status;
      }

      return newErrors;
    });
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
    if (
      !currentLocation.capacity ||
      isNaN(currentLocation.capacity) ||
      currentLocation.capacity <= 0
    ) {
      newErrors.capacity = "Sức chứa phải là số lớn hơn 0";
    }
    if (
      !currentLocation.table ||
      isNaN(currentLocation.table) ||
      currentLocation.table <= 0
    ) {
      newErrors.table = "Số lượng bàn phải là số lớn hơn 0";
    }
    if (
      !currentLocation.cost ||
      isNaN(currentLocation.cost) ||
      currentLocation.cost <= 0
    ) {
      newErrors.cost = "Chi phí phải là số lớn hơn 0";
    }
    if (
      !currentLocation.description ||
      currentLocation.description.trim() === ""
    ) {
      newErrors.description = "Mô tả không được để trống";
    }
    if (!currentLocation.status || currentLocation.status.trim() === "") {
      newErrors.status = "Trạng thái không được để trống";
    }

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const addLocation = async () => {
    try {
      // Kiểm tra form
      if (!validateForm()) {
        toast.error("Vui lòng kiểm tra lại các trường dữ liệu!");
        return;
      }

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

        // Lưu lại vào LocalStorage
        localStorage.setItem("locations", JSON.stringify(savedLocations));

        // Kiểm tra dữ liệu sau khi lưu
        console.log("Dữ liệu lưu vào LocalStorage:", savedLocations);

        toast.success("Địa điểm mới được thêm thành công!");
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
      toast.success("Địa điểm đã được cập nhật thành công!");

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

  const handleAdd = () => {
    addLocation();
  };

  const handleUpdate = () => {
    updateLocation();
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

      toast.success("Địa điểm đã được xóa thành công!");

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

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setPage(selectedPage);
  };

  // Hàm tìm kiếm
const handleSearch = (term) => {
  setSearchTerm(term);

  // Nếu từ khóa tìm kiếm rỗng, hiển thị toàn bộ danh sách
  if (term.trim() === "") {
    setFilteredLocations(locations);
    return;
  }

  // Lọc kết quả tìm kiếm theo các trường: name, type, address, description, creatorName
  const filtered = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(term.toLowerCase()) ||
      location.type.toLowerCase().includes(term.toLowerCase()) ||
      location.address.toLowerCase().includes(term.toLowerCase()) ||
      location.description.toLowerCase().includes(term.toLowerCase()) ||
      location.creatorName.toLowerCase().includes(term.toLowerCase())
  );

  setFilteredLocations(filtered);
};


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <div className="admin-group">
          <input
            placeholder="Tìm kiếm"
            type="search"
            className="admin-input-search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
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
          Add Location
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Bàn</TableCell>
              <TableCell>Chi phí</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(searchTerm ? filteredLocations : locations).map((location, index) => (
              <TableRow key={location.locationId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>
                  <img src={location.image} alt={location.name} width="70" />
                </TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.capacity}</TableCell>
                <TableCell>{location.table}</TableCell>
                <TableCell>{location.cost}</TableCell>
                <TableCell>{location.description}</TableCell>
                <TableCell>{location.creatorName}</TableCell>
                <TableCell>{location.creatorRole}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog("edit", location)}
                  >
                    <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Sửa</span>}
                        placement="top"
                      >
                        <EditIcon />
                      </Tooltip>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(location.locationId)}
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
          {dialogMode === "add" ? "Add Location" : "Edit Location"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            margin="dense"
            name="name"
            label="Tên địa điểm"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          {currentLocation.image && (
            <img
              src={currentLocation.image}
              alt="Dish"
              style={{ width: "100%", height: "250px", marginBottom: "1em" }}
            />
          )}

          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" sx={{ mb: "5px" }}>
             <AddAPhotoIcon sx={{ mr: "3px" }}/>
              Chọn ảnh
            </Button>
          </label>
          <TextField
            margin="dense"
            name="type"
            label="Loại"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.type}
            onChange={handleInputChange}
            error={!!errors.type}
            helperText={errors.type}
          />
          <TextField
            margin="dense"
            name="address"
            label="Địa chỉ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Sức chứa"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.capacity}
            onChange={handleInputChange}
            error={!!errors.capacity}
            helperText={errors.capacity}
          />
          <TextField
            margin="dense"
            name="table"
            label="Bàn"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.table}
            onChange={handleInputChange}
            error={!!errors.table}
            helperText={errors.table}
          />
          <TextField
            margin="dense"
            name="cost"
            label="Chi phí"
            type="number"
            fullWidth
            variant="outlined"
            value={currentLocation.cost}
            onChange={handleInputChange}
            error={!!errors.cost}
            helperText={errors.cost}
          />
          <TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            maxRows={10}
            value={currentLocation.description}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              label="Trạng thái"
              value={currentLocation.status || ""}
              onChange={handleInputChange}
              error={!!errors.status}
              helperText={errors.status}
            >
              <MenuItem value="Hoạt động">Hoạt động</MenuItem>
              <MenuItem value="Đang chờ duyệt">Đang chờ duyệt</MenuItem>
              <MenuItem value="Không hoạt động">Không hoạt động</MenuItem>
              <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            onClick={dialogMode === "add" ? addLocation : updateLocation}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Save
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
