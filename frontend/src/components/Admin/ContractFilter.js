import React, { useState } from "react";
import {
  Box,
  Button,
  Popover,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const ContractFilter = ({ filterType, onApplyFilter, onClearFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onApplyFilter(selectedValue);
    handleClose();
  };

  const handleClear = () => {
    setSelectedValue("");
    onClearFilter();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  return (
    <div>
      <IconButton
        variant="contained"
        onClick={handleOpen}
        sx={{ textTransform: "none" }}
      >
        <FilterListIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: 250,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FormControl fullWidth size="small">
            {/* Nội dung Select thay đổi dựa trên filterType */}
            <InputLabel sx={{ fontSize: "1.1rem" }}>
              {filterType === "contract"
                ? "Trạng thái hợp đồng"
                : "Trạng thái thanh toán"}
            </InputLabel>
            <Select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              sx={{ borderRadius: "6px", fontSize: "1.1rem" }}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {filterType === "contract"
                ? [
                    <MenuItem key="1" value="Đã hoàn thành">
                      Đã hoàn thành
                    </MenuItem>,
                    <MenuItem key="2" value="Đang hoạt động">
                      Đang hoạt động
                    </MenuItem>,
                    <MenuItem key="3" value="Đã hủy">
                      Đã hủy
                    </MenuItem>,
                  ]
                : [
                    <MenuItem key="1" value="Đã thanh toán đầy đủ">
                      Đã thanh toán đầy đủ
                    </MenuItem>,
                    <MenuItem key="2" value="Đã thanh toán một phần">
                      Đã thanh toán một phần
                    </MenuItem>,
                    <MenuItem key="3" value="Chưa thanh toán">
                      Chưa thanh toán
                    </MenuItem>,
                  ]}
            </Select>
          </FormControl>
          <Box
            mt={2}
            justifyContent="space-between"
            gap={2}
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={handleApply}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#125ea5",
                },
              }}
            >
              <FilterListIcon sx={{ mr: 1, fontSize: "1rem" }} />
              Lọc
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              sx={{
                marginLeft:"5px",
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "bold",
              }}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default ContractFilter;
