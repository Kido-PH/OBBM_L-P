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
  FormControl,
  TextField,
  Checkbox,
  Typography,
  TablePagination,
  Autocomplete,
  FormControlLabel,
} from "@mui/material";
import menudishApi from "../../api/menudishAdminApi";
import dishApi from "../../api/dishApi";
import eventApi from "../../api/eventApi";
import menuApi from "../../api/menuAdminApi";
import danhMucApi from "../../api/danhMucApi";
import toast, { Toaster } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Snackbar, Alert } from '@mui/material';


const MenuManager = () => {
  
  const [menuData, setMenuData] = useState({

    name: "",
    description: "",
    totalcost: 0,
    ismanaged: true,
    listMenuDish: [],
    eventId: 0,
    menuId: null,
  });
  const [menus, setMenus] = useState([]);
  const [dishes, setDishes] = useState([]); // Danh sách món ăn
  const [events, setEvents] = useState([]); // Danh sách sự kiện
  const [selectedDishes, setSelectedDishes] = useState([]); // Món ăn được chọn
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái hiển thị dialog
  const [isEdit, setIsEdit] = useState(false); // Kiểm tra đang Thêm hay Sửa
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedDishesByCategory, setSelectedDishesByCategory] = useState({});

  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, info, warning


  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Ẩn Snackbar
  };

  const handleEventChange = (event, newValue) => {
    setMenuData((prevState) => ({
      ...prevState,
      eventId: newValue?.eventId || 0,
      // events: newValue || null,
    }));
  };


  useEffect(() => {
    if (Array.isArray(dishes)) {
      const newFilteredDishes = dishes.filter(
        (dish) =>
          !menuData.listMenuDish.some(
            (selectedDish) => selectedDish.dishId === dish.dishId
          )
      );
      setFilteredDishes(newFilteredDishes);  // Cập nhật filteredDishes
    }
  }, [menuData.listMenuDish, dishes]);  // Khi menuData.listMenuDish hoặc dishes thay đổi

  const handleDishChange = (event, selectedDishes) => {
    setMenuData((prev) => ({
      ...prev,
      listMenuDish: selectedDishes,
    }));
  };




  const handleViewDetailsClick = (menu) => {
    setSelectedMenu(menu);  // Lưu menu đang chọn
    setOpenDetailDialog(true);  // Mở dialog chi tiết
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedMenu(null);  // Đặt lại menu khi đóng dialog
  };

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
      setPageCount(menuRes.result?.totalPages);
      setTotalElements(menuRes.result?.totalElements); // Tổng số trang
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
      console.log("Selected Dishes:", selectedDishes);
    }
  };

  // useEffect để load dữ liệu lần đầu



  // Lấy dữ liệu từ API khi component mount
  const fetchData = async () => {
    try {
      // Gọi API lấy danh sách món ăn (với size lớn)
      const dishes = await dishApi.getAll({
        page: 1,
        size: 1000, // Đặt giá trị đủ lớn để lấy toàn bộ món ăn
      });
      setDishes(dishes.result?.content);

      // Gọi API lấy danh sách sự kiện (với size lớn)
      const events = await eventApi.getAll({
        page: 1,
        size: 1000, // Đặt giá trị đủ lớn để lấy toàn bộ sự kiện
      });
      setEvents(events.result?.content);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };



  // useEffect để load dữ liệu lần đầu
  useEffect(() => {
    fetchCategories();
    fetchData();
    fetchMenusWithPagination(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  // useEffect(() => {
  //   fetchData();
  //   console.log("Menu Data đã cập nhật:", menuData);  // Kiểm tra menuData sau khi set
  // }, [menuData]);  // Mỗi khi menuData thay đổi, sẽ chạy lại useEffect này

  useEffect(() => {
    // Lấy dữ liệu mới từ API mỗi khi `menus` thay đổi
    fetchData();
    console.log("Menu đã cập nhật:", menus);
  }, [menus]); // Chạy lại khi menus thay đổi



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

  const [oldMenuDishes, setOldMenuDishes] = useState([]);

  const handleDeleteDish = (dishId) => {
    // Loại bỏ món ăn khỏi listMenuDish
    setMenuData((prevState) => ({
      ...prevState,
      listMenuDish: prevState.listMenuDish.filter((dish) => dish.dishId !== dishId),
    }));

    // Loại bỏ món ăn khỏi dishes
    setDishes((prevDishes) => prevDishes.filter((dish) => dish.dishId !== dishId));
  };

  const handleEditClick = async (menu) => {
    try {
      // Lấy danh sách món ăn từ API
      const response = await menudishApi.getByMenu(menu.menuId);

      if (response.code !== 1000) {
        throw new Error("Danh sách món ăn không hợp lệ.");
      }

      const updatedMenuDishes = response.result.content || [];

      if (Array.isArray(updatedMenuDishes) && updatedMenuDishes.length > 0) {
        // Lấy danh sách món ăn từ API (giả sử rằng updatedMenuDishes trả về là mảng)
        const dishes = updatedMenuDishes.map(item => item.dishes); // Dùng map để lấy thông tin món ăn từ API

        // Kiểm tra mảng dishes trước khi dùng reduce
        if (Array.isArray(dishes)) {
          const dishesMap = dishes.reduce((acc, dish) => {
            acc[dish.dishId] = dish.name;  // Lưu trữ tên món ăn theo dishId
            return acc;
          }, {});  // Dấu ngoặc đóng cho reduce
        } else {
          console.error("Dishes không phải là mảng hợp lệ:", dishes);
        }

        // Trích xuất sự kiện từ menu và đảm bảo cập nhật đúng eventId
        const eventData = menu.events || null;
        const eventId = eventData ? eventData.eventId : 0;

        // Cập nhật state với món ăn và sự kiện
        setMenuData((prevState) => ({
          ...prevState,
          name: menu.name || prevState.name,
          description: menu.description || prevState.description,
          totalcost: menu.totalcost || prevState.totalcost,
          ismanaged: menu.ismanaged || prevState.ismanaged,
          listMenuDish: updatedMenuDishes.map((menuDish) => ({
            dishId: menuDish.dishes.dishId,
            name: menuDish.dishes.name,
            price: menuDish.dishes.price,
            quantity: menuDish.quantity,
          })),
          eventId: menu.events?.eventId || 0, // Cập nhật eventId đúng
          menuId: menu.menuId || prevState.menuId,
          event: events || null, // Lưu thông tin sự kiện vào state
        }));

        setOldMenuDishes(updatedMenuDishes);
        setIsEdit(true);
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
      toast.error("Không thể lấy danh sách món ăn! Vui lòng thử lại.");
    }
  };

  const handleEditMenu = async () => {
    try {
      const { name, description, eventId, listMenuDish, menuId } = menuData;
  
      if (!name || eventId === 0 || !Array.isArray(listMenuDish) || listMenuDish.length === 0 || !menuId) {
        toast.error("Vui lòng nhập đầy đủ thông tin và danh sách món ăn!");
        return;
      }
  
      const totalCost = listMenuDish.reduce((total, dish) => {
        if (!dish.price || typeof dish.price !== "number") {
          toast.error("Dữ liệu món ăn không hợp lệ!");
          throw new Error("Món ăn không hợp lệ.");
        }
        return total + dish.price * (dish.quantity || 1);
      }, 0);
  
      const updatedMenuPayload = { name, description, totalcost: totalCost, eventId };
      const menuRes = await menuApi.update(menuId, updatedMenuPayload);
  
      if (!menuRes || !menuRes.result) {
        toast.error("Không thể cập nhật menu! Vui lòng thử lại.");
        return;
      }
  
      await menudishApi.deleteAllDish(menuId);
      await menudishApi.saveAllDish(
        listMenuDish.map((dish) => ({
          dishesId: dish.dishId,
          menuId,
          quantity: dish.quantity || 1,
        }))
      );
  
      // Lấy thông tin sự kiện
      const eventRes = await eventApi.get(eventId);
      const eventDetail = eventRes.result?.content;
  
      // Cập nhật danh sách menus
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.menuId === menuId
            ? { ...menu, ...updatedMenuPayload, events: eventDetail } // Cập nhật thông tin sự kiện
            : menu
        )
      );
  
      setMenuData({
        name: "",
        description: "",
        totalcost: 0,
        ismanaged: true,
        listMenuDish: [],
        eventId: 0,
      });
  
      toast.success("Cập nhật menu thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật menu:", error.response?.data || error.message);
      toast.error("Không thể cập nhật menu! Vui lòng thử lại.");
    }
  };
  
  
  
  // Thêm menu mới
  const handleAddMenu = async () => {
    try {
      const { name, description, ismanaged, eventId, listMenuDish } = menuData;
      const userId = "0903e5c7-44fa-4dfc-bbf1-f4a951e84bf2"; // Admin ID mặc định
  
      if (!name || eventId === 0 || !listMenuDish || listMenuDish.length === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin và chọn món ăn!");
        return;
      }
  
      const totalCost = listMenuDish.reduce((total, dish) => {
        const quantity = dish.quantity || 1;
        return total + dish.price * quantity;
      }, 0);
  
      const newMenuPayload = {
        name,
        description,
        totalcost: totalCost,
        userId,
        eventId,
      };
  
      const menuRes = await menuApi.add(newMenuPayload);
      const newMenuId = menuRes.result?.menuId;
  
      if (!newMenuId) {
        toast.error("Không thể thêm menu! Hãy thử lại.");
        return;
      }
  
      const menuDishPayload = listMenuDish.map((dish) => ({
        menuId: newMenuId,
        dishesId: dish.dishId,
        price: dish.price,
        quantity: dish.quantity || 1,
      }));
  
      await menudishApi.saveAllDish(menuDishPayload);
  
      // Lấy thông tin sự kiện
      const eventRes = await eventApi.get(eventId);
      const eventDetail = eventRes.result?.content;
      const NewMenu = {
        ...menuData
      }
      const NewEventId = NewMenu.event?.eventId;
  console.log("eventId:", NewEventId);
      // Cập nhật danh sách menus
      const newMenu = {
        ...menuData,
        // menuId: newMenuId,
        totalcost: totalCost,
        // events: eventDetail,
        eventId: NewEventId
      };
      setMenus((prevMenus) => [newMenu, ...prevMenus]);
  
      // Reset form
      setMenuData({
        name: "",
        description: "",
        totalcost: 0,
        ismanaged: true,
        listMenuDish: [],
        eventId: 0,
      });
  
      toast.success("Thêm menu thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm menu:", error.response?.data || error.message);
      toast.error("Không thể thêm menu! Vui lòng thử lại.");
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


  const filteredMenus = menus
    // .filter((menus) => !menus.Status) // Loại bỏ các sự kiện có `Status` là true
    .filter((menus) => {
      if (searchTerm === "") return true; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      if (!isNaN(searchTerm)) {
        // Nếu nhập số, lọc theo eventId
        return String(menus.menuId).includes(searchTerm);
      }
      // Nếu nhập ký tự, lọc theo các trường khác (ví dụ: name)
      return menus.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const groupedOptions = categories.map((category) => ({
    label: category.name, // Tên danh mục
    categoryId: category.categoryId, // ID danh mục
    options: Array.isArray(dishes)
      ? dishes.filter((dish) => dish.categories?.categoryId === category.categoryId)
      : [], // Nếu `dishes` không phải là mảng, trả về mảng rỗng
  }));




  const filteredGroupedOptions = Object.keys(groupedOptions).map((category) => ({
    label: category,
    options: groupedOptions[category],
  }));

  const handleAddDishToMenu = () => {

    const updatedMenu = {
      ...menuData,
      listMenuDish: [
        ...menuData.listMenuDish, // Giữ lại các món đã chọn trước đó
        ...Object.values(selectedDishesByCategory).flat(), // Thêm tất cả món đã chọn theo từng danh mục
      ],
      // eventId:menuData.eventId

    };
     // Sẽ trả undefined nếu event không tồn tại

    setMenuData(updatedMenu); // Cập nhật lại state menu
    console.log("Thêm menu:", updatedMenu); // Kiểm tra kết quả
    if (updatedMenu) {
      setSnackbarMessage('Đã thêm món ăn vào menu!');
      setSnackbarSeverity('success');
      handleClose();
    } else {
      setSnackbarMessage('Thêm món ăn thất bại!');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true); // Hiển thị Snackbar
  };


  const handleRemoveDish = (categoryId, dishId) => {
    // Loại bỏ món ăn khỏi selectedDishesByCategory
    setSelectedDishesByCategory((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter((dish) => dish.dishId !== dishId),
    }));

    // Loại bỏ món ăn khỏi listMenuDish
    setMenuData((prev) => ({
      ...prev,
      listMenuDish: prev.listMenuDish.filter((dish) => dish.dishId !== dishId),
    }));

    console.log("Updated listMenuDish:", menuData.listMenuDish);
  };



  const handleDishChangeByCategory = (categoryId, updatedDishes) => {
    // Cập nhật selectedDishesByCategory
    setSelectedDishesByCategory((prev) => ({
      ...prev,
      [categoryId]: updatedDishes, // Lưu danh sách món đã được lọc
    }));

    // Cập nhật listMenuDish
    setMenuData((prev) => ({
      ...prev,
      listMenuDish: prev.listMenuDish.filter(
        (dish) =>
          !(
            dish.categories?.categoryId === categoryId &&
            !updatedDishes.some((updatedDish) => updatedDish.dishId === dish.dishId)
          )
      ),
    }));

    console.log("Updated listMenuDish:", menuData.listMenuDish);
  };





  const handleDishSelection = (dishId) => {
    setMenuData((prev) => {
      // Kiểm tra xem món ăn đã có trong danh sách chưa
      const isAlreadySelected = prev.listMenuDish.some(
        (dish) => dish.dishId === dishId
      );

      // Nếu đã chọn, xóa món ăn khỏi danh sách; nếu chưa, thêm vào
      const updatedList = isAlreadySelected
        ? prev.listMenuDish.filter((dish) => dish.dishId !== dishId)
        : [...prev.listMenuDish, dishes.find((dish) => dish.dishId === dishId)];

      return {
        ...prev,
        listMenuDish: updatedList,
      };


    });
  };


  return (
    <Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Ẩn sau 3 giây
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí hiển thị
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity} // success, error, info, warning
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
          Thêm thực đơn
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
            {filteredMenus.map((menus) => (
              <TableRow key={menus.menuId}>
                {/* Tên menu */}
                <TableCell>{menus.name}</TableCell>

                {/* Mô tả menu */}
                <TableCell>{menus.description}</TableCell>

                {/* Tổng chi phí */}
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  }).format(menus.totalcost)}
                </TableCell>

                {/* Tên sự kiện liên kết */}
                <TableCell>{menus.events?.name}</TableCell>

                {/* Nút sửa và xóa */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => {handleEditClick(menus)}}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDeleteMenu(menus.menuId)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleViewDetailsClick(menus)}  // Mở chi tiết menu
                  >
                    <ErrorOutlineIcon />
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
          <Box sx={{ marginBottom: "16px" }}>
            <Typography
              sx={{
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#000", // Màu đen cho label
              }}
            >
              Tên menu
            </Typography>
            <TextField
              fullWidth
              value={menuData.name}
              onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px", // Bo góc
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd", // Màu viền mặc định
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000", // Màu viền khi hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000", // Màu viền khi focus
                },
              }}
            />
          </Box>
          <Box sx={{ marginBottom: "16px" }}>
            <Typography
              sx={{
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#000", // Màu đen cho label
              }}
            >
              Sự kiện
            </Typography>
            <FormControl fullWidth>
              <Autocomplete
                value={menuData.event || null}
                options={events}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.eventId === value?.eventId}
                onChange={(event, newValue) => {
                  setMenuData((prevState) => ({
                    ...prevState,
                    eventId: newValue?.eventId || 0,
                    event: newValue || null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn sự kiện"
                    variant="outlined"
                    sx={{
                      '.MuiOutlinedInput-root': {
                        padding: '6px', // Tăng khoảng cách bên trong của TextField
                      },
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-listbox': {
                    maxHeight: '300px',
                    overflowY: 'auto',
                  },
                  '& .MuiAutocomplete-option': {
                    fontSize: '16px',
                    padding: '8px',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    color: '#000',
                  },
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#000',
                  },
                  '& .MuiAutocomplete-loading': {
                    color: '#000',
                  },
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{
                marginTop: '12px',
                marginBottom: '12px', // Khoảng cách phía trên
                fontSize: '14px', // Kích thước font chữ vừa phải
                padding: '8px 16px', // Khoảng cách bên trong vừa đủ
                borderRadius: '6px', // Bo góc nhẹ nhàng
                fontWeight: 'bold', // Chữ đậm hơn
                textTransform: 'none', // Không in hoa toàn bộ chữ
                background: 'linear-gradient(90deg, #3f51b5, #5a75f0)', // Hiệu ứng gradient
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Bóng đổ nhẹ
                transition: 'all 0.3s ease-in-out', // Hiệu ứng chuyển đổi mượt
                '&:hover': {
                  background: 'linear-gradient(90deg, #2c387e, #4c5bd4)', // Màu gradient khi hover
                  boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)', // Bóng đổ đậm hơn khi hover
                },
                '&:active': {
                  transform: 'scale(0.98)', // Nhấn nhẹ nút xuống khi click
                },
              }}
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
                  <Box>
                    {groupedOptions.map((group) => (
                      <Box key={group.categoryId} sx={{ marginBottom: "32px" }}>
                        {/* Autocomplete cho danh mục */}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "16px" }}
                        >
                          {group.label}
                        </Typography>
                        <Autocomplete
                          multiple
                          options={group.options} // Chỉ món ăn thuộc danh mục
                          value={selectedDishesByCategory[group.categoryId] || []}
                          onChange={(event, selectedDishes) => {
                            console.log("Selected Dishes for Category:", group.label, selectedDishes); // Kiểm tra món ăn được chọn
                            handleDishChangeByCategory(group.categoryId, selectedDishes);
                          }}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, value) => option.dishId === value.dishId}
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn món ăn" variant="outlined" />
                          )}
                        />
                        {/* Table hiển thị món ăn đã chọn */}
                      </Box>
                    ))}
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên món ăn</TableCell>
                          <TableCell>Giá gốc</TableCell>
                          <TableCell>Danh mục</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Duyệt qua các nhóm danh mục */}
                        {groupedOptions.map((group) => (
                          <>
                            {/* Dòng chứa tên danh mục */}
                            <TableRow key={group.categoryId}>
                              <TableCell colSpan={4} style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                {group.label} {/* Tên danh mục */}
                              </TableCell>
                            </TableRow>

                            {/* Duyệt qua món ăn của danh mục này */}
                            {(selectedDishesByCategory[group.categoryId] || []).map((dish) => (
                              <TableRow key={dish.dishId}>
                                <TableCell>{dish.name}</TableCell>
                                <TableCell>{dish.price}</TableCell>
                                <TableCell>{group.label}</TableCell> {/* Hiển thị danh mục của món ăn */}
                                <TableCell>
                                  <Button
                                    color="error"
                                    onClick={() => handleRemoveDish(group.categoryId, dish.dishId)}
                                  >
                                    Xóa
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>

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
          </Box>
          <Box sx={{ marginBottom: "16px" }}>
            <Typography
              sx={{
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#000", // Màu đen cho label
              }}
            >
              Mô tả
            </Typography>
            <TextField
              fullWidth
              value={menuData.description}
              onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000", // Màu viền khi hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000", // Màu viền khi focus
                },
              }}
            />
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

      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Chi tiết Menu: {selectedMenu?.name}</DialogTitle>
        <DialogContent>
          {/* Hiển thị thông tin chi tiết của Menu */}
          <Typography variant="h6">Mô tả: {selectedMenu?.description}</Typography>
          <Typography variant="h6">Tổng chi phí:
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              currencyDisplay: "code",
            }).format(selectedMenu?.totalcost)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Danh sách món ăn:</Typography>
          <Table className="table-container">
            <TableHead>
              <TableRow>
                <TableCell>Tên món ăn</TableCell>
                <TableCell>Giá</TableCell>
                {/* <TableCell>Hình ảnh</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedMenu?.listMenuDish && selectedMenu.listMenuDish.length > 0 ? (
                selectedMenu.listMenuDish.map((menuDish) => (
                  <TableRow key={menuDish.menudishId}>
                    <TableCell>{menuDish.dishes.name}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        currencyDisplay: "code",
                      }).format(menuDish.dishes.price)}
                    </TableCell>
                    {/* <TableCell>
                      <img src={`${menuDish?.dishes?.image}`} alt={dishes.name} width="70" />
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Không có món ăn nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>



    </Box>
  );
};

export default MenuManager;
