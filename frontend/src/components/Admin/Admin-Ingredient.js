import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import dishApi from "../../api/dishApi";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const sampleIngredients = {
  1: [ // Salad Trái Cây
    {
      ingredientId: 1,
      name: "Táo",
      quantity: "100g",
      unit: "g",
      transndate: "2024-11-10",
      description: "Táo tươi ngon."
    },
    {
      ingredientId: 2,
      name: "Dưa hấu",
      quantity: "150g",
      unit: "g",
      transndate: "2024-11-10",
      description: "Dưa hấu ngọt mát."
    },
    {
      ingredientId: 3,
      name: "Nho",
      quantity: "50g",
      unit: "g",
      transndate: "2024-11-10",
      description: "Nho xanh tươi."
    },
    {
      ingredientId: 4,
      name: "Cam",
      quantity: "1 quả",
      unit: "quả",
      transndate: "2024-11-10",
      description: "Cam ngọt."
    },
  ],
  2: [ // Món bò
    {
      ingredientId: 5,
      name: "Thịt bò",
      quantity: "200g",
      unit: "g",
      transndate: "2024-11-11",
      description: "Thịt bò tươi ngon."
    },
    {
      ingredientId: 6,
      name: "Tỏi",
      quantity: "5g",
      unit: "g",
      transndate: "2024-11-11",
      description: "Tỏi thơm."
    },
    {
      ingredientId: 7,
      name: "Hành tây",
      quantity: "50g",
      unit: "g",
      transndate: "2024-11-11",
      description: "Hành tây tươi."
    },
    {
      ingredientId: 8,
      name: "Gia vị",
      quantity: "5g",
      unit: "g",
      transndate: "2024-11-11",
      description: "Gia vị cho món ăn thêm đậm đà."
    },
  ],
  3: [ // Bánh Kem
    {
      ingredientId: 9,
      name: "Bột mì",
      quantity: "100g",
      unit: "g",
      transndate: "2024-11-12",
      description: "Bột mì cao cấp."
    },
    {
      ingredientId: 10,
      name: "Trứng",
      quantity: "2 quả",
      unit: "quả",
      transndate: "2024-11-12",
      description: "Trứng gà tươi."
    },
    {
      ingredientId: 11,
      name: "Đường",
      quantity: "50g",
      unit: "g",
      transndate: "2024-11-12",
      description: "Đường cát trắng."
    },
    {
      ingredientId: 12,
      name: "Kem tươi",
      quantity: "100g",
      unit: "g",
      transndate: "2024-11-12",
      description: "Kem tươi ngon, mịn."
    },
  ],
  4: [ // Mì Ý Bò Bằm
    {
      ingredientId: 13,
      name: "Mì Ý",
      quantity: "150g",
      unit: "g",
      transndate: "2024-11-13",
      description: "Mì Ý tươi ngon."
    },
    {
      ingredientId: 14,
      name: "Thịt bò bằm",
      quantity: "100g",
      unit: "g",
      transndate: "2024-11-13",
      description: "Thịt bò xay nhuyễn."
    },
    {
      ingredientId: 15,
      name: "Cà chua",
      quantity: "50g",
      unit: "g",
      transndate: "2024-11-13",
      description: "Cà chua tươi."
    },
    {
      ingredientId: 16,
      name: "Hành tây",
      quantity: "30g",
      unit: "g",
      transndate: "2024-11-13",
      description: "Hành tây thái mỏng."
    },
  ],
  5: [ // Gà Chiên Giòn
    {
      ingredientId: 17,
      name: "Gà",
      quantity: "200g",
      unit: "g",
      transndate: "2024-11-14",
      description: "Gà tươi, thịt ngon."
    },
    {
      ingredientId: 18,
      name: "Bột chiên giòn",
      quantity: "100g",
      unit: "g",
      transndate: "2024-11-14",
      description: "Bột chiên giòn cao cấp."
    },
    {
      ingredientId: 19,
      name: "Dầu ăn",
      quantity: "50ml",
      unit: "ml",
      transndate: "2024-11-14",
      description: "Dầu ăn tinh khiết."
    },
    {
      ingredientId: 20,
      name: "Muối",
      quantity: "3g",
      unit: "g",
      transndate: "2024-11-14",
      description: "Muối biển tự nhiên."
    },
  ],
  6: [ // Cá Hấp Xì Dầu
    {
      ingredientId: 21,
      name: "Cá",
      quantity: "200g",
      unit: "g",
      transndate: "2024-11-15",
      description: "Cá tươi, không xương."
    },
    {
      ingredientId: 22,
      name: "Xì dầu",
      quantity: "20ml",
      unit: "ml",
      transndate: "2024-11-15",
      description: "Xì dầu đậm đà."
    },
    {
      ingredientId: 23,
      name: "Gừng",
      quantity: "5g",
      unit: "g",
      transndate: "2024-11-15",
      description: "Gừng tươi, gọt vỏ."
    },
    {
      ingredientId: 24,
      name: "Hành lá",
      quantity: "10g",
      unit: "g",
      transndate: "2024-11-15",
      description: "Hành lá tươi."
    },
  ],
  7: [ // Súp Bông Cải
    {
      ingredientId: 25,
      name: "Bông cải",
      quantity: "150g",
      unit: "g",
      transndate: "2024-11-16",
      description: "Bông cải tươi."
    },
    {
      ingredientId: 26,
      name: "Sữa tươi",
      quantity: "50ml",
      unit: "ml",
      transndate: "2024-11-16",
      description: "Sữa tươi nguyên chất."
    },
    {
      ingredientId: 27,
      name: "Bơ",
      quantity: "20g",
      unit: "g",
      transndate: "2024-11-16",
      description: "Bơ mềm, thơm."
    },
    {
      ingredientId: 28,
      name: "Hành tây",
      quantity: "30g",
      unit: "g",
      transndate: "2024-11-16",
      description: "Hành tây thái mỏng."
    },
  ],
  // Các món ăn khác tiếp theo theo cách thức tương tự...
};


const IngredientManager = () => {
  const [dishes, setDishes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedDish, setSelectedDish] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialogState, setOpenDeleteDialogState] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const itemsPerPage = 5; // Number of items per page

  const handleIngredientSelection = (ingredient) => {
    setCurrentIngredient(ingredient);
    setOpenDialog(true);
  };

  const fetchDishes = async () => {
    try {
      const params = { page: 1, size: 100 };
      const response = await dishApi.getAll(params);
      const dishesData = response.result?.content || [];
      setDishes(dishesData);
    } catch (error) {
      console.error("Failed to fetch dishes: ", error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleDishChange = (event) => {
    const selectedDishId = event.target.value;
    setSelectedDish(selectedDishId);
    const selectedIngredients = sampleIngredients[selectedDishId] || [];
    setIngredients(selectedIngredients);
    setFilteredIngredients(selectedIngredients);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredDishes = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchValue)
    );

    if (filteredDishes.length > 0) {
      const selectedDishId = filteredDishes[0].dishId;
      setSelectedDish(selectedDishId);
      const selectedIngredients = sampleIngredients[selectedDishId] || [];
      setIngredients(selectedIngredients);
      setFilteredIngredients(selectedIngredients);
    } else {
      setSelectedDish("");
      setIngredients([]);
      setFilteredIngredients([]);
    }
  };

  const openIngredientDialog = (ingredient = null) => {
    setCurrentIngredient(ingredient);
    setOpenDialog(true);
  };

  const closeIngredientDialog = () => {
    setOpenDialog(false);
    setCurrentIngredient(null);
  };

  const handleChange = (field, value) => {
    setCurrentIngredient({ ...currentIngredient, [field]: value });
  };

  const handleSaveIngredient = () => {
    if (!currentIngredient) {
      return; // Early return if no ingredient is selected
    }

    const { ingredientId, name, quantity, unit, transndate, description } = currentIngredient;

    if (ingredientId) {
      // Update existing ingredient
      const updatedIngredients = ingredients.map((ingredient) =>
        ingredient.ingredientId === ingredientId
          ? { ...ingredient, name, quantity, unit, transndate, description }
          : ingredient
      );
      setIngredients(updatedIngredients);
      setFilteredIngredients(updatedIngredients);
    } else {
      // Add new ingredient
      const newIngredient = {
        ingredientId: ingredients.length + 1,
        name,
        quantity,
        unit,
        transndate,
        description,
      };
      setIngredients([...ingredients, newIngredient]);
      setFilteredIngredients([...ingredients, newIngredient]);
    }

    closeIngredientDialog(); // Close the dialog after saving
  };

  const handleOpenDeleteDialog = (ingredient) => {
    setCurrentIngredient(ingredient);
    setOpenDeleteDialogState(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialogState(false);
    setCurrentIngredient(null);
  };

  const handleDeleteIngredient = () => {
    const updatedIngredients = ingredients.filter(
      (ingredient) => ingredient.ingredientId !== currentIngredient.ingredientId
    );
    setIngredients(updatedIngredients);
    setFilteredIngredients(updatedIngredients);
    closeDeleteDialog();
  };

  // Handle page click
  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // Set current page
  };

  // Calculate the ingredients to display based on current page
  const displayedIngredients = filteredIngredients.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Calculate total pages
  const pageCount = Math.ceil(filteredIngredients.length / itemsPerPage);

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm món ăn hoặc nguyên liệu..."
          sx={{ mx: 1, width: "200px" }}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <FormControl fullWidth margin="dense" sx={{ mx: 1, width: "200px" }}>
          <InputLabel shrink>Món ăn</InputLabel>
          <Select
            value={selectedDish || ""}
            onChange={handleDishChange}
            label="Món ăn"
            displayEmpty
          >
            <MenuItem value="">
              <em>Chọn món ăn</em>
            </MenuItem>

            {dishes
              .filter((dish) =>
                dish.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((dish) => (
                <MenuItem key={dish.dishId} value={dish.dishId}>
                  {dish.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          sx={{ fontSize: "10px", display: "flex", alignItems: "center", padding: "6px 12px" }}
          variant="contained"
          color="primary"
          onClick={() => openIngredientDialog()}
        >
          <AddIcon sx={{ marginRight: "5px", fontSize: "16px" }} />
          Add Ingredient
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>Mã nguyên liệu</TableCell>
              <TableCell>Tên nguyên liệu</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Ngày thay đổi</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedIngredients.length > 0 ? (
              displayedIngredients.map((ingredient, index) => (
                <TableRow key={ingredient.ingredientId}>
                  <TableCell>{index + 1 + currentPage * itemsPerPage}</TableCell>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.quantity}</TableCell>
                  <TableCell>{ingredient.unit}</TableCell>
                  <TableCell>{formatDate(ingredient.transndate)}</TableCell>
                  <TableCell>{ingredient.description}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => openIngredientDialog(ingredient)}
                      variant="outlined"
                      size="small"
                      sx={{ marginRight: "5px" }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      onClick={() => handleOpenDeleteDialog(ingredient)}
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có nguyên liệu phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
   

      {/* Dialog Thêm/Sửa Nguyên Liệu */}
      <Dialog open={openDialog} onClose={closeIngredientDialog}>
        <DialogTitle>{currentIngredient ? "Sửa nguyên liệu" : "Thêm nguyên liệu"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên nguyên liệu"
            fullWidth
            value={currentIngredient ? currentIngredient.name : ""}
            onChange={(e) => handleChange("name", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Số lượng"
            fullWidth
            value={currentIngredient ? currentIngredient.quantity : ""}
            onChange={(e) => handleChange("quantity", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Đơn vị"
            fullWidth
            value={currentIngredient ? currentIngredient.unit : ""}
            onChange={(e) => handleChange("unit", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Ngày thay đổi"
            fullWidth
            type="datetime-local"
            value={currentIngredient ? currentIngredient.transndate : ""}
            onChange={(e) => handleChange("transndate", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={currentIngredient ? currentIngredient.description : ""}
            onChange={(e) => handleChange("description", e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeIngredientDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveIngredient} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xóa Nguyên Liệu */}
      <Dialog open={openDeleteDialogState} onClose={closeDeleteDialog}>
        <DialogTitle>Xác nhận xóa nguyên liệu</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa nguyên liệu "{currentIngredient?.name}" không?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleDeleteIngredient} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IngredientManager;