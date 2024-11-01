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
  Input,
  Tooltip,
  TextareaAutosize,
} from "@mui/material";
import dishApi from "../../api/dishApi";
import danhMucApi from "../../api/danhMucApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dish1 from "../../assets/images/food-menu-1.png";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

const DishManager = () => {
  const [categories, setCategories] = useState([]); // State cho danh mục
  const [dishes, setDishes] = useState([]); // State cho danh sách món ăn
  const [open, setOpen] = useState(false); // State để điều khiển Dialog
  const [editMode, setEditMode] = useState(false); // State cho chế độ sửa món ăn
  const [selectedDishId, setSelectedDishId] = useState(null); // Để lưu id món ăn khi sửa
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    existing: "",
    categoryId: "",
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const SIZE_DISH = 5;

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
  }

  );

  // Nạp danh sách danh mục và món ăn khi component được mount
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const responseCategory = await danhMucApi.getAll(); // Lấy tất cả danh mục
    //     const responseDish = await dishApi.getAll(); // Lấy tất cả món ăn
    //     setCategories(responseCategory.result.content); // Cập nhật state categories
    //     setDishes(responseDish.result.content); // Cập nhật state dishes
    //   } catch (error) {
    //     console.error("Không tìm thấy danh mục: ", error);
    //   }
    // };

    // fetchData(); // Gọi API khi component mount
    fetchMonAnWithPaginate(1);
  }, []);

  // Hàm đổ dữ liệu & phân trang
  const fetchMonAnWithPaginate = async (page) => {
    try {
      const responseCategory = await danhMucApi.getPaginate(page, SIZE_DISH); 
      const res = await dishApi.getPaginate(page, SIZE_DISH);
      setCategories(responseCategory.result.content);
      setDishes(res.result.content);
      setPageCount(res.result.totalPages);
      console.log("res.dt = ", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  }

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
    setSelectedDishId(null); // Clear dish id sau khi sửa hoặc thêm
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setDishData({ ...dishData, image: imageUrl });
    } else {
      setDishData({ ...dishData, [name]: value });
    }
  };

  // Hàm xử lý thêm món ăn
  const handleAddDish = async () => {
    try {
      await dishApi.add(dishData); // Thêm món ăn mới

      // Hiển thị toast thông báo thêm thành công
      toast.success("Món ăn đã được thêm thành công!");

      // Gọi API để lấy lại danh sách món ăn mới sau khi thêm
      const responseDish = await dishApi.getAll();

      setDishes(responseDish.result.content);
      setPageCount(responseDish.result.totalPages);
    } catch (error) {
      console.error("Lỗi khi thêm món ăn: ", error);
    }
  };

  // Hàm xử lý cập nhật món ăn
  const handleUpdateDish = async () => {
    if (!selectedDishId) {
      console.error("Không tìm thấy ID món ăn để cập nhật."); // Log lỗi
      return; // Ngưng thực hiện nếu không có ID
    }

    try {
      const dataToUpdate = { ...dishData, id: selectedDishId }; // Thêm ID vào dữ liệu
      
      await dishApi.update(dataToUpdate); // Cập nhật món ăn

      // Hiển thị toast để thông báo sửa thành công
      toast.success("Món ăn đã được cập nhật thành công!");

      // Gọi API để lấy lại danh sách món ăn mới sau khi cập nhật
      const responseDish = await dishApi.getAll();
      setDishes(responseDish.result.content);
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn: ", error);
    }
  };

  // Hàm để Thêm & cập nhật
  const handleSaveDish = async () => {
    if (editMode && selectedDishId) {
      await handleUpdateDish(); // Gọi hàm cập nhật
    } else {
      await handleAddDish(); // Gọi hàm thêm mới
    }

    handleClose();
  };

  // Hàm xử lý xóa món ăn
  const handleDeleteDish = async (dishId) => {
    try {
      const response = await dishApi.delete(dishId); // Xóa món ăn

      // Hiển thị toast để thông báo xóa thành công
      toast.success("Món ăn đã được xóa thành công!");

      const responseDish = await dishApi.getAll(); // Lấy lại danh sách món ăn

      console.log("Delete response: ", response);

      setDishes(responseDish.result.content); // Cập nhật danh sách món ăn mới
    } catch (error) {
      console.error("Lỗi khi xóa món ăn: ", error);
    }
  };

  // Hàm mở dialog và nạp dữ liệu món ăn vào form để sửa
  const handleEditDish = (dish, dishId) => {
    setDishData({
      name: dish.name,
      price: dish.price,
      image: dish.image,
      description: dish.description,
      existing: dish.existing,
      categoryId: dish.categoryId || "", // Sử dụng categoryId (đảm bảo không undefined)
    });
    setSelectedDishId(dish.dishId); // Lưu id món ăn cần sửa
    setEditMode(true); // Bật chế độ sửa
    setOpen(true);
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    fetchMonAnWithPaginate(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  }

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
            placeholder="Search"
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight:'bold' }}>
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
          />
          <TextField
            margin="dense"
            name="price"
            label="Giá"
            type="number"
            fullWidth
            value={dishData.price}
            onChange={handleChange}
          />
          {/* <TextField
            margin="dense"
            name="image"
            label="Hình ảnh (URL)"
            type="text"
            fullWidth
            value={dishData.image}  
            onChange={handleChange}
            disabled
          /> */}

          {dishData.image && (

            <img
          src={dish1}
          alt="Dish"
          style={{ width: "100%", height: "250px", marginBottom: "1em" }}
        />

          )}
          <Input
            margin="dense"
            name="image"
            type="file"
            fullWidth
            onChange={handleChange}
          />
          <TextareaAutosize 
            className="admin-mota"
            minRows={3} // Số dòng tối thiểu
            name="description"
            label="Mô tả"
            type="text" 
            value={dishData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId" // Đổi thành categoryId
              value={dishData.categoryId || ""} // Đổi thành categoryId
              onChange={handleChange}
              label="Danh mục"
            >
              {categories.length > 0 ? ( // Kiểm tra xem categories có không
                categories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Không có danh mục</MenuItem> // Thông báo nếu không có danh mục
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
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSaveDish}>
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
            {filteredDishes.map((dish) => (
                <TableRow key={dish.dishId}>
                  <TableCell>{dish.dishId}</TableCell>
                  <TableCell>{dish.name}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(dish.price)}</TableCell>
                  <TableCell>
                    <img src={dish1} alt={dish.name} width="70" />
                  </TableCell>
                  <TableCell>{dish.description}</TableCell>
                  <TableCell>{dish.existing}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditDish(dish)}
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