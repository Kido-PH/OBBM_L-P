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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";

import dishApi from "../../api/dishApi";
import danhMucApi from "../../api/danhMucApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

const DishManager = () => {
  const [categories, setCategories] = useState([]); // State cho danh mục
  const [dishes, setDishes] = useState([]); // State cho danh sách món ăn
  const [open, setOpen] = useState(false); // State để điều khiển Dialog
  const [editMode, setEditMode] = useState(false); // State cho chế độ sửa món ăn
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    categoryId: "",
    existing: "Còn hàng",
  });
  const [dishId, setDishId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const SIZE_DISH = 5;
  const [errors, setErrors] = useState({
    name: "",
    price: "",
  });
  const validateForm = () => {
    let tempErrors = { name: "", price: "", categoryId: "" };
    let isValid = true;

    if (!dishData.name.trim()) {
      tempErrors.name = "Tên món ăn không được để trống";
      isValid = false;
    }

    if (
      !dishData.price ||
      isNaN(dishData.price) ||
      Number(dishData.price) <= 0
    ) {
      tempErrors.price = "Giá món ăn phải là số và lớn hơn 0";
      isValid = false;
    }

    if (!dishData.categoryId) {
      tempErrors.categoryId = "Vui lòng chọn danh mục";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Hàm tìm kiếm
  const filteredDishes = dishes.filter((dish) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.price.toString().includes(searchTermLower) ||
      dish.description.toLowerCase().includes(searchTermLower) ||
      dish.existing.toLowerCase().includes(searchTermLower) ||
      (dish.categoryId && dish.categoryId.toString().includes(searchTermLower))
    );
  });

  // Hàm để tải toàn bộ danh mục
  const fetchAllCategories = async () => {
    try {
      const response = await danhMucApi.getAll();
      setCategories(response.result.content || []);
      console.log("Toàn bộ danh mục:", response.result.content);
    } catch (error) {
      console.error("Không tải được danh mục: ", error);
    }
  };

  // Nạp danh sách danh mục một lần khi component được mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Hàm để nạp món ăn theo trang
  const fetchDishesWithPaginate = async (page) => {
    try {
      const res = await dishApi.getPaginate(page, SIZE_DISH);
      setDishes(res.result.content || []);
      setPageCount(res.result.totalPages);
      console.log("Món ăn:", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được món ăn: ", error);
    }
  };

  // Nạp danh sách danh mục và món ăn khi component được mount
  useEffect(() => {
    fetchDishesWithPaginate(page);
  }, [page, dishData]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false); // Tắt chế độ sửa khi đóng dialog
    setDishData({
      name: "",
      price: "",
      image: "",
      description: "",
      existing: "",
      categoryId: "", // Reset lại id danh mục
    });
    setDishId(null); // Clear dish id sau khi sửa hoặc thêm
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      // Lấy tên file và gán cứng vào thư mục /images/dish
      const imageName = file.name;
      const imagePath = `/images/dish/${imageName}`; // Đường dẫn hình ảnh
      setDishData({ ...dishData, image: imagePath });
    } else {
      setDishData({ ...dishData, [name]: value });
    }

    // Xóa lỗi khi người dùng nhập dữ liệu hợp lệ
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (name === "name" && value.trim()) {
        updatedErrors.name = "";
      }

      if (name === "price" && value && Number(value) > 0) {
        updatedErrors.price = "";
      }

      if (name === "categoryId" && value) {
        updatedErrors.categoryId = "";
      }

      return updatedErrors;
    });
  };

  const handleAddDish = async () => {
    try {
      console.log("Dish data being sent: ", dishData);

      if (!dishData.name || !dishData.price || !dishData.categoryId) {
        toast.error("Vui lòng điền đầy đủ thông tin món ăn!");
        return;
      }

      const response = await dishApi.add(dishData);

      toast.success("Món ăn đã được thêm thành công!");

      console.log("Món ăn mới thêm:", response.result);

      // Directly update the dish list with the new dish at the top
      setDishes((prevDishes) => [response.result, ...prevDishes]);
    } catch (error) {
      console.error("Lỗi khi thêm món ăn: ", error);
      toast.error("Có lỗi xảy ra khi thêm món ăn!");
    }
  };

  // Xử lý fill thông tin món ăn để chỉnh sửa
  const handleEditDish = (dishId) => {
    const dishToEdit = dishes.find((dish) => dish.dishId === dishId);

    if (dishToEdit) {
      setEditMode(true);
      setDishData({
        name: dishToEdit.name,
        price: dishToEdit.price,
        image: dishToEdit.image,
        description: dishToEdit.description,
        existing: dishToEdit.existing,
        categoryId: dishToEdit.categoryId,
      });
      setDishId(dishToEdit.dishId);
      setOpen(true);
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

  const handleUpdateDish = async () => {
    if (!setDishId) {
      toast.error("Không tìm thấy ID của món ăn!");
      return;
    }

    // Kiểm tra các trường cần thiết
    if (!dishData.name || !dishData.price || !dishData.categoryId) {
      toast.error("Vui lòng điền đầy đủ thông tin món ăn!");
      return;
    }

    try {
      // Kiểm tra nếu image là Blob và chuyển đổi nó thành base64
      let base64Image = dishData.image;
      if (dishData.image instanceof Blob) {
        base64Image = await convertBlobToBase64(dishData.image);
      }

      // Cập nhật dữ liệu mà không cần thêm lại id (vì id đã có trong URL)
      const updatedDishData = {
        name: dishData.name,
        price: dishData.price ? Number(dishData.price) : 0,
        description: dishData.description,
        existing: dishData.existing,
        categoryId: dishData.categoryId,
        image: base64Image, // Gán ảnh base64 vào data
      };

      console.log(updatedDishData); // Kiểm tra lại dữ liệu gửi đi

      // Gửi yêu cầu PUT để cập nhật món ăn
      await dishApi.update(dishId, updatedDishData);

      toast.success("Món ăn đã được cập nhật thành công!");

      // Lấy lại danh sách món ăn của trang hiện tại
      fetchDishesWithPaginate(page);
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error);
      if (error.response) {
        console.log("Response error data:", error.response.data); // Kiểm tra dữ liệu lỗi trả về từ server
      }
      toast.error("Có lỗi xảy ra khi cập nhật món ăn!");
    }

    // Đóng dialog sau khi cập nhật
    handleClose();
  };

  const handleSaveDish = async () => {
    if (!validateForm()) {
      return; // Nếu có lỗi, không tiếp tục thêm hoặc cập nhật
    }

    if (editMode && setDishId) {
      await handleUpdateDish(); // Gọi hàm cập nhật
    } else {
      await handleAddDish(); // Gọi hàm thêm mới
    }
    handleClose();
  };

  const handleDeleteDish = (dishId) => {
    const dish = dishes.find((dish) => dish.dishId === dishId);

    // Lưu món ăn cần xóa và mở hộp thoại xác nhận
    setDishToDelete(dish);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDish = async () => {
    try {
      // Xóa món ăn khi người dùng xác nhận
      await dishApi.delete(dishToDelete.dishId);

      // Hiển thị thông báo thành công
      toast.success("Món ăn đã được xóa thành công!");

      fetchDishesWithPaginate(page);
    } catch (error) {
      console.error("Lỗi khi xóa món ăn: ", error);
      toast.error("Có lỗi xảy ra khi xóa món ăn.");
    }

    // Đóng hộp thoại xác nhận
    setDeleteDialogOpen(false);
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setPage(selectedPage);
    console.log(`User requested page number ${event.selected}`);
  };

  return (
    <Box>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Ô tìm kiếm */}
      <div className="admin-toolbar">
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

        {/* Nút thêm món ăn */}
        <Button
          sx={{
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            padding: "6px 12px", // Adjust padding if needed
            lineHeight: "1.5", // Ensures proper vertical alignment
          }}
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          <AddIcon
            sx={{
              marginRight: "5px",
              fontSize: "16px",
              verticalAlign: "middle",
            }}
          />
          Thêm Món Ăn
        </Button>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle
          id="confirm-delete-title"
          sx={{
            fontSize: "1.6rem",
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          <ErrorOutlineIcon sx={{ color: "error.main", mr: 1 }} /> Xác nhận xóa
          món ăn
        </DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa món ăn "{dishToDelete?.name}" không?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
            sx={{ fontSize: "1.3rem" }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDeleteDish}
            color="secondary"
            sx={{ fontSize: "1.3rem" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight: "bold" }}
        >
          {editMode ? "Cập nhật món ăn" : "Thêm món ăn mới"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            margin="dense"
            name="name"
            label="Tên món ăn"
            type="text"
            fullWidth
            value={dishData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            FormHelperTextProps={{
              sx: {
                fontSize: "1rem",
                color: "red",
              },
            }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Giá"
            type="number"
            fullWidth
            value={dishData.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
            FormHelperTextProps={{
              sx: {
                fontSize: "1rem",
                color: "red",
              },
            }}
          />

          {dishData.image && (
            <img
              src={dishData.image}
              alt="Dish"
              style={{ width: "100%", height: "250px", marginBottom: "1em" }}
            />
          )}

          <input
            type="file"
            name="image"
            onChange={handleChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" sx={{ mb: "5px" }}>
              <AddAPhotoIcon sx={{ mr: "3px" }} />
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
            rows={3}
            maxRows={10}
            value={dishData.description}
            onChange={handleChange}
            error={Boolean(errors.description)}
            helperText={errors.description}
            sx={{
              "& .MuiFormHelperText-root": {
                fontSize: "1rem", // Tăng kích thước chữ của helper text
              },
            }}
          />

          <FormControl
            fullWidth
            margin="dense"
            error={Boolean(errors.categoryId)}
          >
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={dishData.categoryId || ""}
              onChange={handleChange}
              label="Danh mục"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Không có danh mục</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="dish-existing-label">Còn món ăn không?</InputLabel>
            <Select
              labelId="dish-existing-label"
              name="existing"
              value={dishData.existing}
              onChange={handleChange}
              label="Còn món ăn không?"
            >
              <MenuItem value={"Còn hàng"}>Còn hàng</MenuItem>
              <MenuItem value={"Hết hàng"}>Hết hàng</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ fontSize: "1.3rem" }}>
            Hủy
          </Button>
          <Button onClick={handleSaveDish} sx={{ fontSize: "1.3rem" }}>
            {editMode ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên món ăn</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDishes.map((dish, index) => (
              <TableRow key={dish.dishId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{dish.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dish.price)}
                </TableCell>
                <TableCell>
                  <img src={`${dish.image}`} alt={dish.name} width="70" />
                </TableCell>
                <TableCell>{dish.description}</TableCell>
                <TableCell>{dish.existing}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditDish(dish.dishId)}
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
                    onClick={() => handleDeleteDish(dish.dishId)}
                    color="secondary"
                    sx={{
                      fontSize: "1.5rem",
                      color: "#d32f2f",
                      "&:hover": {
                        color: "#f44336", 
                        transform: "scale(1.1)", 
                      },
                    }}
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
    </Box>
  );
};

export default DishManager;
