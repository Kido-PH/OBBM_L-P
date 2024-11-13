import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Dữ liệu mẫu người dùng
const initialUsers = [
  {
    username: "baotran",
    name: "Lê Thị Bảo Trân",
    phone: "0987654321",
    status: "Đang hoạt động",
  },
  {
    username: "thaihoa",
    name: "Nguyễn Thị Thái Hòa",
    phone: "0978654321",
    status: "Đang hoạt động",
  },
];

const AccessControl = () => {
  const [users] = useState(initialUsers);
  const [expandedUser, setExpandedUser] = useState(null); // Lưu trữ người dùng đã chọn để hiển thị chi tiết
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");

  // Xử lý khi nhấp vào hàng
  const handleRowClick = (user) => {
    setExpandedUser(expandedUser === user ? null : user); // Đóng lại nếu nhấp vào người dùng đang mở
    setSelectedTab(0); // Đặt tab mặc định là "Thông tin"
  };

  // Xử lý chuyển tab
  const handleTabChange = (event, newValue) => setSelectedTab(newValue);

  return (
    <Box p={3}>
      {/* Bảng danh sách người dùng */}
      <TableContainer
        component={Paper}
        className="table-container"
        sx={{ boxShadow: 3, borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Tên đăng nhập
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Tên người dùng
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Điện thoại
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <React.Fragment key={index}>
                {/* Hàng người dùng */}
                <TableRow
                  onClick={() => handleRowClick(user)}
                  style={{ cursor: "pointer" }}
                  sx={{
                    "&:hover": { backgroundColor: "#eaf4ff" },
                    backgroundColor:
                      expandedUser === user ? "#eaf4ff" : "inherit",
                  }}
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell sx={{ fontSize: "1.1rem" }}>
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1.1rem" }}>{user.name}</TableCell>
                  <TableCell sx={{ fontSize: "1.1rem" }}>
                    {user.phone}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: user.status === "Đang hoạt động" ? "green" : "red",
                    }}
                  >
                    {user.status}
                  </TableCell>
                </TableRow>

                {/* Hàng chi tiết mở rộng */}
                {expandedUser === user && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{ backgroundColor: "#f9f9f9", padding: 20 }}
                    >
                      <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        centered
                        sx={{
                          marginBottom: 2,
                          "& .MuiTab-root": { fontSize: "1.1rem" },
                        }}
                      >
                        <Tab
                          label="Thông tin"
                          sx={{ fontSize: "1.4rem", fontWeight: "bold" }}
                        />
                        <Tab
                          label="Phân quyền"
                          sx={{ fontSize: "1.4rem", fontWeight: "bold" }}
                        />
                      </Tabs>

                      {selectedTab === 0 && (
                        <Box
                          mt={2}
                          display="grid"
                          gridTemplateColumns="1fr 1fr"
                          gap={2}
                        >
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Tên đăng nhập:</strong>{" "}
                            {user.username.toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Tên người dùng:</strong>{" "}
                            {user.name.toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Điện thoại:</strong> {user.phone}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Ngày sinh:</strong> 01/01/1990
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Email:</strong> {user.username}@example.com
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Trạng thái:</strong>{" "}
                            <span
                              style={{ fontWeight: "bold", color: "green" }}
                            >
                              {user.status}
                            </span>
                          </Typography>
                        </Box>
                      )}

                      {selectedTab === 1 && (
                        <Box
                          p={3}
                          sx={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: "20px",
                          }}
                        >
                          <Typography
                            variant="h5"
                            mb={3}
                            sx={{ fontWeight: "bold", color: "#333" }}
                          >
                            Phân quyền
                          </Typography>

                          {/* Vai trò - ComboBox */}
                          <Box display="flex" alignItems="center" mb={3}>
                            <Typography
                              variant="h6"
                              sx={{ marginRight: "8px" }}
                            >
                              Vai trò:
                            </Typography>
                            <FormControl size="small" variant="outlined">
                              <Select
                                value={selectedRole}
                                onChange={(event) =>
                                  setSelectedRole(event.target.value)
                                }
                                displayEmpty
                                sx={{
                                  minWidth: "200px",
                                  fontSize: "1rem",
                                }}
                              >
                                <MenuItem value="">
                                  <em>Chọn vai trò</em>
                                </MenuItem>
                                <MenuItem value="admin">Quản trị viên</MenuItem>
                                <MenuItem value="staff">Nhân viên</MenuItem>
                                <MenuItem value="user">Người dùng</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box
                            display="grid"
                            gridTemplateColumns="repeat(3, 1fr)"
                            gap={3}
                            sx={{
                              padding: "20px",
                              backgroundColor: "#ffffff",
                              borderRadius: "16px",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {/* USER Permissions */}
                            <Accordion
                              sx={{
                                boxShadow: 2,
                                borderRadius: "8px",
                                backgroundColor: "#e3f2fd",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: "#00796b" }} />
                                }
                                sx={{
                                  padding: "0 16px",
                                  minHeight: 56,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  sx={{
                                    color: "#00796b",
                                    padding: 0,
                                    marginRight: 1,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: "bold", color: "#00796b" }}
                                >
                                  USER
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {[
                                    "Xem DS",
                                    "Thêm mới người dùng",
                                    "Cập nhật người dùng",
                                    "Xóa người dùng",
                                  ].map((item) => (
                                    <ListItem
                                      key={item}
                                      sx={{ padding: "4px 16px" }}
                                    >
                                      <ListItemIcon
                                        sx={{
                                          minWidth: "auto",
                                          paddingRight: 1,
                                        }}
                                      >
                                        <Checkbox sx={{ color: "#00796b" }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                          sx: { fontSize: "1rem" },
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>

                            {/* DISH Permissions */}
                            <Accordion
                              sx={{
                                boxShadow: 2,
                                borderRadius: "8px",
                                backgroundColor: "#e8f5e9",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: "#43a047" }} />
                                }
                                sx={{
                                  padding: "0 16px",
                                  minHeight: 56,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  sx={{
                                    color: "#43a047",
                                    padding: 0,
                                    marginRight: 1,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: "bold", color: "#43a047" }}
                                >
                                  DISH
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {[
                                    "Xem DS",
                                    "Thêm mới món ăn",
                                    "Cập nhật món ăn",
                                    "Xóa món ăn",
                                  ].map((item) => (
                                    <ListItem
                                      key={item}
                                      sx={{ padding: "4px 16px" }}
                                    >
                                      <ListItemIcon
                                        sx={{
                                          minWidth: "auto",
                                          paddingRight: 1,
                                        }}
                                      >
                                        <Checkbox sx={{ color: "#43a047" }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                          sx: { fontSize: "1rem" },
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>

                            {/* CONTRACT Permissions */}
                            <Accordion
                              sx={{
                                boxShadow: 2,
                                borderRadius: "8px",
                                backgroundColor: "#ffebee",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: "#e53935" }} />
                                }
                                sx={{
                                  padding: "0 16px",
                                  minHeight: 56,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  sx={{
                                    color: "#e53935",
                                    padding: 0,
                                    marginRight: 1,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: "bold", color: "#e53935" }}
                                >
                                  CONTRACT
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {[
                                    "Chỉnh sửa hợp đồng",
                                    "Xác nhận hợp đồng",
                                    "Hủy hợp đồng",
                                    "Xem thông tin hợp đồng",
                                  ].map((item) => (
                                    <ListItem
                                      key={item}
                                      sx={{ padding: "4px 16px" }}
                                    >
                                      <ListItemIcon
                                        sx={{
                                          minWidth: "auto",
                                          paddingRight: 1,
                                        }}
                                      >
                                        <Checkbox sx={{ color: "#e53935" }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                          sx: { fontSize: "1rem" },
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        </Box>
                      )}

                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="flex-start"
                        gap={1}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ fontSize: "1.4rem", textTransform: "none" }}
                        >
                          Cập nhật
                        </Button>
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ fontSize: "1.4rem", textTransform: "none" }}
                        >
                          Sao chép
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ fontSize: "1.4rem", textTransform: "none" }}
                        >
                          Ngưng hoạt động
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ fontSize: "1.4rem", textTransform: "none" }}
                        >
                          Xóa người dùng
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccessControl;
