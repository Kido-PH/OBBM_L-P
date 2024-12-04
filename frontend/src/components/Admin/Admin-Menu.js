import React, { useState, useEffect } from "react";
import {
  Button,
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  TablePagination,
} from "@mui/material";
import menudishApi from "../../api/menudishApi";
import dishApi from "../../api/dishApi";
import eventApi from "../../api/eventApi";
import menuApi from "../../api/menuAdminApi";
import danhMucApi from "../../api/danhMucApi";
import toast, { Toaster } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";


const MenuManager = () => {
  const [menuData, setMenuData] = useState({

    name: "",
    description: "",
    totalcost: 0,
    ismanaged: true,
    listMenuDish: [], // Danh sách món ăn đã chọn
    eventId: 0,
    menuId: null,
  });

  const [dishes, setDishes] = useState([]); // Danh sách món ăn
  const [events, setEvents] = useState([]); // Danh sách sự kiện
  const [menus, setMenus] = useState([]); // Danh sách menu đã có
  const [selectedDishes, setSelectedDishes] = useState([]); // Món ăn được chọn
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái hiển thị dialog
  const [isEdit, setIsEdit] = useState(false); // Kiểm tra đang Thêm hay Sửa
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    console.log("check page: ", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };
  const fetchMenusWithPagination = async (page) => {
    try {
      const menuRes = await menuApi.getPaginate(page, rowsPerPage);
      setMenus(menuRes.result?.content || []);
      setPageCount(menuRes.result?.totalPages); // Tổng số trang
      console.log(menuRes.result?.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách menu: ", error);
      toast.error("Không thể tải danh sách menu!");
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await danhMucApi.getAll({});
      setCategories(response.result?.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục: ", error);
      console.log("Dishes Map:", dishesMap);
      console.log("Selected Dishes:", selectedDishes);
    }
  };

  const filteredGroupedOptions = categories.map((category) => ({
    label: category.name,
    options: dishes
      .filter(
        (dish) =>
          dish.categories?.categoryId === category.categoryId &&
          !menuData.listMenuDish.some((menuDish) => menuDish.dishId === dish.dishId)
      ) // Lọc món ăn không nằm trong bảng
      .map((dish) => ({
        value: dish.dishId,
        label: dish.name
      })),
  }));




  // useEffect để load dữ liệu lần đầu
  const dishesMap = dishes.reduce((acc, dish) => {
    acc[dish.dishId] = dish.name;
    return acc;
  }, {});


  // Lấy dữ liệu từ API khi component mount
  const fetchData = async () => {
    try {
      // Gọi API lấy danh sách món ăn (với size lớn)
      const dishRes = await dishApi.getAll({
        page: 1,
        size: 1000, // Đặt giá trị đủ lớn để lấy toàn bộ món ăn
      });
      setDishes(dishRes.result?.content);

      // Gọi API lấy danh sách sự kiện (với size lớn)
      const eventRes = await eventApi.getAll({
        page: 1,
        size: 1000, // Đặt giá trị đủ lớn để lấy toàn bộ sự kiện
      });
      setEvents(eventRes.result?.content);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };



  // useEffect để load dữ liệu lần đầu
  useEffect(() => {
    fetchCategories();
    fetchData();
    fetchMenusWithPagination(page);
  }, [page]);


  // Xử lý sự kiện mở dialog thêm menu
  const handleOpenAddDialog = () => {
    setMenuData({
      name: "",
      description: "",
      totalcost: 0,
      ismanaged: true,
      listMenuDish: [],
      eventId: 0,
    });
    setIsEdit(false);
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setMenuData({
      name: "",
      description: "",
      totalcost: 0,
      ismanaged: true,
      listMenuDish: [],
      eventId: 0,
    });
    setOpenDialog(false);
  };

  // Thêm hoặc sửa menu
  const handleSaveMenu = async () => {
    if (isEdit) {
      // Gọi hàm cập nhật menu
      await handleEditMenu();
    } else {
      // Gọi hàm thêm menu
      await handleAddMenu();
    }
  };
  const handleEditClick = (menu) => {
    setMenuData({
      ...menu,
      menuId: menu.menuId,  // Gán menuId khi mở form chỉnh sửa
      event: menu.events,    // Gán event (sự kiện)
      listMenuDish: menu.listMenuDish,  // Gán toàn bộ danh sách món ăn
    });

    setIsEdit(true);         // Đặt chế độ chỉnh sửa
    setOpenDialog(true);     // Mở dialog sửa
  };

  // Thêm menu mới
  // Thêm Menu
  const handleAddMenu = async () => {
    try {
      const { name, description, ismanaged, eventId, listMenuDish } = menuData;
      const userId = "0903e5c7-44fa-4dfc-bbf1-f4a951e84bf2"; // Admin ID mặc định

      // Kiểm tra nếu thiếu thông tin quan trọng
      if (!name || eventId === 0 || !listMenuDish || listMenuDish.length === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin và chọn món ăn!");
        return;
      }

      // Tính tổng chi phí
      const calculateTotalCost = () => {
        return listMenuDish.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
      };

      const totalCost = calculateTotalCost();  // Tính tổng chi phí trước khi gửi đi

      // Tạo payload cho menu
      const newMenuPayload = {
        name,
        description,
        totalcost: totalCost,  // Tính tổng chi phí cho menu
        userId,
        eventId,
      };

      // Gửi yêu cầu thêm menu
      const menuRes = await menuApi.add(newMenuPayload);
      const newMenuId = menuRes.result?.menuId;

      if (!newMenuId) {
        toast.error("Không thể thêm menu! Hãy thử lại.");
        return;
      }

      // Tạo payload cho các món ăn
      const menuDishPayload = listMenuDish.map((dish) => ({
        menuId: newMenuId,
        dishesId: dish.dishId,  // Truy cập theo đúng trường
        price: dish.price,
        quantity: dish.quantity
      }));

      // Kiểm tra lại payload
      console.log("Payload gửi đến menudishApi.saveAllDish:", menuDishPayload);

      // Gửi tất cả món ăn cùng một lúc
      try {
        await menudishApi.saveAllDish(menuDishPayload);
        console.log("Thêm món ăn thành công");
      } catch (error) {
        console.error("Lỗi khi thêm nhiều món ăn:", error.response?.data || error.message);
        toast.error("Lỗi khi thêm món ăn. Vui lòng thử lại.");
        return; // Dừng lại nếu có lỗi khi thêm món ăn
      }

      // Cập nhật danh sách menu trong state
      setMenus([...menus, { ...menuData, menuId: newMenuId, totalcost: totalCost }]);

      // Reset form và đóng dialog
      setMenuData({
        name: "",
        description: "",
        totalcost: 0,
        ismanaged: true,
        listMenuDish: [],
        eventId: 0
      });

      toast.success("Thêm menu thành công!");

    } catch (error) {
      console.error("Lỗi khi thêm menu:", error.response?.data || error.message);
      toast.error("Không thể thêm menu! Vui lòng thử lại.");
    }
  };

  // Cập nhật Menu
  const handleEditMenu = async () => {
    try {
      const { name, description, ismanaged, eventId, listMenuDish, menuId } = menuData;

      // Kiểm tra nếu thiếu thông tin quan trọng
      if (!menuId || !name || eventId === 0 || !listMenuDish || listMenuDish.length === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin và chọn món ăn!");
        return;
      }

      // Tính tổng chi phí cho menu
      const totalCost = listMenuDish.reduce((total, dish) => total + (dish.price * dish.quantity), 0);

      // Tạo payload cho menu
      const updatedMenuPayload = {
        name,
        description,
        totalcost: totalCost,
        eventId,
      };

      // Gửi yêu cầu cập nhật menu
      const menuRes = await menuApi.update(menuId, updatedMenuPayload);
      if (!menuRes || !menuRes.result) {
        toast.error("Không thể cập nhật menu! Hãy thử lại.");
        return;
      }

      // Lấy danh sách món ăn hiện tại trong menu (dùng API getByMenu)
      const existingMenuDishes = await menudishApi.getByMenu(menuId, 0, 100);  // Điều chỉnh pagination nếu cần
      console.log("Dữ liệu món ăn trong menu:", existingMenuDishes);

      // Kiểm tra xem result.content có tồn tại và là mảng không
      if (!existingMenuDishes || !Array.isArray(existingMenuDishes.result.content) || existingMenuDishes.result.content.length === 0) {
        toast.error("Không có món ăn trong menu này.");
        return;
      }

      // Lấy danh sách các dishId đã có trong listMenuDish
      const newDishIds = listMenuDish.map(dish => dish.dishId);

      // Tìm các món ăn không còn trong listMenuDish (cần xóa)
      const dishesToDelete = existingMenuDishes.result.content.filter(dish => !newDishIds.includes(dish.dishesId));

      // Xóa các món ăn không còn trong listMenuDish
      for (let dish of dishesToDelete) {
        try {
          // Gọi API để xóa món ăn khỏi menudish
          await menudishApi.delete(dish.menudishId);
          console.log(`Món ăn với dishId ${dish.dishesId} đã bị xóa khỏi menu`);
        } catch (error) {
          console.error("Lỗi khi xóa món ăn:", error.response?.data || error.message);
          toast.error("Lỗi khi xóa món ăn. Vui lòng thử lại.");
          return;  // Dừng lại nếu có lỗi khi xóa món ăn
        }
      }

      // Tạo payload cho các món ăn mới hoặc món ăn đã được cập nhật
      const menuDishPayload = listMenuDish.map((dish) => ({
        menuId,  // Sử dụng menuId đã có sẵn
        dishesId: dish.dishId,  // Truy cập theo đúng trường
        price: dish.price,
        quantity: dish.quantity,
      }));

      // Gửi tất cả món ăn mới hoặc đã được cập nhật
      try {
        await menudishApi.saveAllDish(menuDishPayload);
        console.log("Cập nhật món ăn thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật món ăn:", error.response?.data || error.message);
        toast.error("Lỗi khi cập nhật món ăn. Vui lòng thử lại.");
        return;  // Dừng lại nếu có lỗi khi cập nhật món ăn
      }

      // Cập nhật danh sách menu trong state
      const updatedMenu = { ...menuData, totalcost: totalCost };
      setMenus(menus.map(menu => menu.menuId === menuId ? updatedMenu : menu));

      // Reset form và đóng dialog
      setMenuData({
        name: "",
        description: "",
        totalcost: 0,
        ismanaged: true,
        listMenuDish: [],
        eventId: 0
      });

      toast.success("Cập nhật menu thành công!");

    } catch (error) {
      console.error("Lỗi khi cập nhật menu:", error.response?.data || error.message);
      toast.error("Không thể cập nhật menu! Vui lòng thử lại.");
    }
  };




  //Delete
  const handleDeleteMenu = async (menuId) => {
    try {
      if (!menuId) {
        toast.error("Không tìm thấy menu để xóa!");
        return;
      }

      // Hiển thị xác nhận trước khi xóa
      if (!window.confirm("Bạn có chắc chắn muốn xóa menu này?")) {
        return;
      }

      // Gửi yêu cầu xóa menu
      await menuApi.delete(menuId);

      // Cập nhật danh sách menu trong state sau khi xóa
      const updatedMenus = menus.filter((menu) => menu.menuId !== menuId);
      setMenus(updatedMenus);

      toast.success("Xóa menu thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa menu:", error.response?.data || error.message);
      toast.error("Không thể xóa menu! Vui lòng thử lại.");
    }
  };


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDishSelection = (dishId) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const handleAddDishToMenu = () => {
    const newDishes = selectedDishes.map((dishId) => {
      const selectedDish = dishes.find((d) => d.dishId === dishId);
      return {
        dishId: selectedDish.dishId,
        name: selectedDish.name,
        price: selectedDish.price || 0,  // Thêm giá nếu có
        quantity: 1,  // Đặt mặc định số lượng là 1
      };
    });

    setMenuData((prev) => ({
      ...prev,
      listMenuDish: [...prev.listMenuDish, ...newDishes],
    }));

    setSelectedDishes([]); // Reset selected dishes
  };

  // Hàm xóa món ăn
  const handleRemoveDish = (dishId) => {
    setMenuData((prev) => ({
      ...prev,
      listMenuDish: prev.listMenuDish.filter((dish) => dish.dishId !== dishId),
    }));
  };

  const filteredMenus = menus
    .filter((menus) => !menus.Status) // Loại bỏ các sự kiện có `Status` là true
    .filter((menus) => {
      if (searchTerm === "") return true; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      if (!isNaN(searchTerm)) {
        // Nếu nhập số, lọc theo eventId
        return String(menus.menuId).includes(searchTerm);
      }
      // Nếu nhập ký tự, lọc theo các trường khác (ví dụ: name)
      return menus.name.toLowerCase().includes(searchTerm.toLowerCase());
    });



  return (
    <Box>
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

        <Button
          sx={{ fontSize: "10px" }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenAddDialog("add", null)}
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
      </div>

      {/* Danh sách menu */}
      <TableContainer component={Paper}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>Tên menu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Tổng chi phí</TableCell>
              <TableCell>Sự kiện</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMenus.map((menu) => (
              <TableRow key={menu.menuId}>
                {/* Tên menu */}
                <TableCell>{menu.name}</TableCell>

                {/* Mô tả menu */}
                <TableCell>{menu.description}</TableCell>

                {/* Tổng chi phí */}
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(menu.totalcost)}
                </TableCell>

                {/* Tên sự kiện liên kết */}
                <TableCell>{menu.events?.name}</TableCell>

                {/* Nút sửa và xóa */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(menu)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDeleteMenu(menu.menuId)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

      {/* Dialog thêm/sửa menu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ padding: '8px 16px', fontSize: '20px' }}>
          {isEdit ? "Chỉnh sửa Menu" : "Thêm Menu Mới"}
        </DialogTitle>
        <DialogContent className="custom-input" dividers sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', position: 'relative' }}>
          <TextField
            label="Tên menu"
            fullWidth
            margin="normal"
            value={menuData.name}
            onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sự kiện</InputLabel>
            <Select
              value={menuData.eventId}
              onChange={(e) => setMenuData({ ...menuData, eventId: e.target.value })}
            >
              {events.map((event) => (
                <MenuItem key={event.eventId} value={event.eventId}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            value={menuData.description}
            onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
          />
          <Box sx={{ width: "100%" }}>
            {/* Button to open the modal */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{ marginBottom: '16px', fontSize: '16px', padding: '8px 20px' }}
            >
              Chọn món ăn
            </Button>

            {/* Modal */}
            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="md"
              fullWidth
              sx={{
                "& .MuiDialog-paper": {
                  boxShadow: "none",
                  padding: "0",
                  border: "none",
                },
              }}
            >
              <DialogTitle
                sx={{
                  padding: '16px 24px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                Chọn món ăn
              </DialogTitle>
              <DialogContent sx={{ minWidth: '400px', padding: '16px' }}>
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {filteredGroupedOptions.map((group) => (
                    <Box key={group.label} sx={{ width: '100%' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#3f51b5',
                          fontSize: '18px',
                          marginBottom: '8px',
                        }}
                      >
                        {group.label}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '16px',
                        }}
                      >
                        {group.options.length === 0 ? (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: '14px', textAlign: 'center' }}
                          >
                            Không có món ăn nào
                          </Typography>
                        ) : (
                          group.options.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              control={
                                <Checkbox
                                  checked={selectedDishes.includes(option.value)}
                                  onChange={() => handleDishSelection(option.value)}
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#3f51b5',
                                    },
                                    transform: 'scale(1.5)',
                                  }}
                                />
                              }
                              label={
                                <Typography sx={{ fontSize: '16px', marginLeft: '8px' }}>
                                  {option.label}
                                </Typography>
                              }
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                padding: '8px',
                                flex: '0 0 auto',
                                width: 'calc(33.33% - 16px)',
                              }}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions sx={{ padding: '8px 16px' }}>
                <Button onClick={handleClose} color="secondary" sx={{ padding: '8px 16px', fontSize: '16px' }}>
                  Hủy
                </Button>
                <Button onClick={handleAddDishToMenu} color="primary" sx={{ padding: '8px 16px', fontSize: '16px' }}>
                  Thêm vào menu
                </Button>
              </DialogActions>
            </Dialog>

            {/* Table to display selected dishes */}
            <TableBody>
              {menuData.listMenuDish && menuData.listMenuDish.length > 0 ? (
                menuData.listMenuDish.map((menuDish) => (
                  <TableRow key={menuDish.dishId} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                    {/* Hiển thị tên món ăn */}
                    <TableCell sx={{ fontSize: '16px', padding: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {menuDish.name ? menuDish.name : "Tên món ăn không có"}
                    </TableCell>
                    {/* Hiển thị giá món ăn */}
                    <TableCell sx={{ fontSize: '16px', padding: '12px' }}>
                      {menuDish.price || 0} {/* Nếu không có giá, hiển thị 0 */}
                    </TableCell>
                    {/* Cung cấp chức năng xóa món ăn */}
                    <TableCell sx={{ fontSize: '16px', padding: '12px' }}>
                      <Button
                        onClick={() => handleRemoveDish(menuDish.dishId)}  // Gọi handleRemoveDish với dishId
                        color="error"
                        sx={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: '#ffcccb',
                          },
                        }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', padding: '16px' }}>
                    Không có món ăn nào trong menu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Box>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveMenu} color="primary" variant="contained">
            {isEdit ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster position="top-center" />

    </Box>
  );
};

export default MenuManager;
