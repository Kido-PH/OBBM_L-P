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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import danhMucApi from "../../api/danhMucApi";
import { toast, Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

const CategoryDish = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]); // Lưu trữ danh sách danh mục
  const [searchTerm, setSearchTerm] = useState("");
  const SIZE_CATEGORY = 5;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  // State cho Dialog xác nhận xóa
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  // Tìm và nạp Danh mục khi thành phần gắn liên kết
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzMwNDY1ODU5LCJpYXQiOjE3MzA0NjQwNTksImp0aSI6IjQwZTQxNzIyLTZlY2MtNDg3Ni04MGE5LWU4ODM5NGM5MzlhYiIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.COtk4hFVa6RfsHFYLkuoJOoI9DawW7CqxNpuPWswzvBbfdgaMzgGh2WHQ27xIXVAdBN9KS1H8AqAkMFwcNgXnA";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    // fetchDanhMuc();
    fetchDanhMucWithPaginate(page); // Lấy trang đầu tiên
  }, []);

  // Hàm lấy tất cả listcategory
  const fetchDanhMuc = async () => {
    try {
      const responseCategories = await danhMucApi.getAll();
      setCategories(responseCategories.result.content); //Đặt kết quả vào state
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  // Hàm đổ dữ liệu & phân trang
  const fetchDanhMucWithPaginate = async (page) => {
    try {
      const res = await danhMucApi.getPaginate(page, SIZE_CATEGORY);
      setCategories(res.result.content);
      setPageCount(res.result.totalPages);
      console.log("res.dt = ", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Đóng modal
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentIndex(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  // Mở Dialog xác nhận xóa
  const handleOpenConfirmDelete = (categoryId) => {
    setCurrentIndex(categoryId);
    setOpenConfirmDelete(true); // Mở dialog xác nhận xóa
  };

  // Đóng Dialog xác nhận xóa
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  // Xử lý thêm danh mục món ăn (async là hàm bất đồng bộ)
  const handleAddCategory = async () => {
    if (categoryName && categoryDescription) {
      try {
        // Tìm ID lớn nhất hiện có trong danh sách
        const maxId =
          categories.length > 0
            ? Math.max(...categories.map((category) => category.categoryId))
            : 0;
        const newCategoryId = maxId + 1;

        const danhMucMoi = {
          categoryId: newCategoryId,
          name: categoryName,
          description: categoryDescription,
        };

        const response = await danhMucApi.add(danhMucMoi); // Gọi API để thêm danh mục

        // Cập nhật danh mục mới vào danh sách và sắp xếp theo ID giảm dần
        const updatedCategories = [response.result, ...categories];
        // updatedCategories.sort((a, b) => b.categoryId - a.categoryId);

        setCategories(updatedCategories);

        // Hiển thị toast thông báo thành công
        toast.success("Danh mục đã được thêm thành công!");

        handleClose();
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
      }
    } else {
      console.error("Vui lòng điền đầy đủ thông tin.");
    }
  };

  // Xử lý fill danh mục món ăn để chỉnh sửa
  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(
      (category) => category.categoryId === categoryId
    );

    if (categoryToEdit) {
      setEditMode(true);
      setCategoryName(categoryToEdit.name); // Lấy thông tin danh mục
      setCategoryDescription(categoryToEdit.description); // Lấy thông tin mô tả danh mục
      setCurrentIndex(categoryId);
      setOpen(true);
    }
  };

  // Cập nhật danh mục món ăn
  const handleUpdateCategory = async () => {
    if (categoryName && categoryDescription && currentIndex !== null) {
      try {
        const updatedCategory = {
          id: currentIndex,
          name: categoryName,
          description: categoryDescription,
        };

        // Gọi API cập nhật danh mục
        const response = await danhMucApi.update(updatedCategory);

        // Cập nhật danh mục trong state sau khi API trả về thành công
        const updatedCategories = categories.map((category) =>
          category.categoryId === currentIndex
            ? {
                ...category,
                name: response.result.name,
                description: response.result.description,
              }
            : category
        );
        setCategories(updatedCategories);

        // Hiển thị toast thông báo chỉnh sửa thành công
        toast.success("Danh mục đã được chỉnh sửa thành công!");

        handleClose(); // Đóng modal sau khi sửa xong
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
      }
    } else {
      console.error("Vui lòng điền đầy đủ thông tin.");
    }
  };

  // Xóa danh mục món ăn
  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId) {
      console.error("categoryId không hợp lệ.");
      return;
    }

    try {
      // Gọi API để xóa danh mục
      await danhMucApi.delete(categoryId);

      // Cập nhật danh sách danh mục sau khi xóa
      const updatedCategories = categories.filter(
        (category) => category.categoryId !== categoryId
      );

      setCategories(updatedCategories);

      toast.success("Danh mục đã được xóa thành công!");

      setCurrentIndex(null); // Đặt lại currentIndex sau khi xóa xong
    } catch (error) {
      console.error("Lỗi khi xóa danh mục: ", error);
    }
    handleCloseConfirmDelete(); // Đóng hộp thoại xác nhận
  };

  // Hàm xử lý thay đổi giá trị input tìm kiếm
  const handleSearchChange = async (event) =>  {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
        try {
          const res = await danhMucApi.getPaginate(page, SIZE_CATEGORY);
          setCategories(res.result.content);
          setPageCount(res.result.totalPages);
        } catch (error) {
          console.error("Không tìm nạp được danh mục: ", error);
        }
    } else {
      // Lọc danh sách hiện tại dựa trên từ khóa
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase()) ||
        category.description.toLowerCase().includes(value.toLowerCase()) 
      );
      setCategories(filtered);
    }
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    fetchDanhMucWithPaginate(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  return (
    <Box>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="admin-toolbar">
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
            placeholder="Search"
            type="search"
            className="admin-input-search"
            value={searchTerm}
            onChange = {handleSearchChange}
          />
        </div>

        {/* Nút Thêm */}
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
          onClick={handleClickOpen}
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

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-delete-title"
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
          <ErrorOutlineIcon sx={{ color: "error.main", mr: 1 }} />
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDelete}
            color="primary"
            sx={{ fontSize: "1.3rem" }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteCategory(currentIndex)}
            color="error"
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
          {editMode ? "Sửa Danh Mục Món" : "Thêm Danh Mục Món"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            label="Tên Danh Mục"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô Tả"
            type="text"
            fullWidth
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Hủy
          </Button>
          <Button
            onClick={editMode ? handleUpdateCategory : handleAddCategory}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            {editMode ? "Cập Nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => {
              return (
                <TableRow key={category.categoryId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditCategory(category.categoryId)}
                      style={{ marginRight: "8px" }}
                    >
                      <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Sửa</span>}
                        placement="top"
                      >
                        <EditIcon />
                      </Tooltip>
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleOpenConfirmDelete(category.categoryId)
                      }
                    >
                      <Tooltip
                        title={<span style={{ fontSize: "1.25rem" }}>Xóa</span>}
                        placement="top"
                      >
                        <DeleteIcon />
                      </Tooltip>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default CategoryDish;
