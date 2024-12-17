import React, { useState, useEffect } from "react";
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
  ListItemIcon,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddUserStaff from "./Admin-AddStaff";
import SnackBarNotification from "./SnackBarNotification";
import roleApi from "../../api/roleAdmin";
import { checkAccessToken } from "services/checkAccessToken";
import { useNavigate } from "react-router-dom";

const AccessControl = () => {
const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null); // Lưu trữ người dùng đã chọn để hiển thị chi tiết
  const [selectedTab, setSelectedTab] = useState(0);
  const [roles, setRoles] = useState([]); // Dữ liệu vai trò từ API
  const [perGroups, setPergroups] = useState([]); // Dữ liệu nhóm quyền API
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Danh sách quyền
  const [selectedRole, setSelectedRole] = useState(""); // Vai trò hiện tại
  const [selectedUserId, setSelectedUserId] = useState(""); // ID người dùng được chọn
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);


  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });

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

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };
  


  // Mở/Đóng Modal
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // Xử lý input role
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRole = async () => {
    // Trích xuất chỉ tên quyền từ selectedPermissions
    const roleToCreate = {
      name: newRole.name,
      description: newRole.description,
      permissions: selectedPermissions.map((permission) => permission.name), // Lấy chỉ tên quyền
    };

    try {
      const response = await roleApi.create(roleToCreate);
      console.log("Role data to be sent:", roleToCreate);
      showSuccess("Thêm quyền cho người dùng thành công!");
      handleCloseModal();

      // Reload trang
      window.location.reload();
      // Reset hoặc đóng modal sau khi thành công
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Lỗi khi tạo role:", error.response ? error.response.data : error);
      alert("Có lỗi xảy ra khi tạo vai trò. Vui lòng thử lại.");
    }
  };

  const handleOpenConfirmDialog = () => {
    if (!selectedRole) {
      showError("Vui lòng chọn vai trò cần xóa!");
      return;
    }
    setOpenConfirmDialog(true);
  };
  

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };


  const handleConfirmDelete = async () => {
    try {
      await roleApi.delete(selectedRole); // Gọi API xóa
      setRoles((prevRoles) => prevRoles.filter((role) => role.name !== selectedRole)); // Cập nhật danh sách
      setSelectedRole(""); // Reset lựa chọn
      setOpenConfirmDialog(false); // Đóng dialog
      showSuccess("Vai trò đã được xóa thành công!");
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Lỗi khi xóa vai trò:", error);
      alert("Xóa vai trò thất bại. Vui lòng thử lại.");
    }
  };


  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    fetchPergroups();
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/obbm/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        if (data.result && Array.isArray(data.result)) {
          const staffUsers = data?.result?.filter((user) =>
            user.roles.some((role) => role.name.startsWith("STAFF"))
          );
          setUsers(staffUsers);
        } else {
          console.error("Dữ liệu không hợp lệ:", data);
          setUsers([]);
        }
      } else {
        console.error("Lỗi khi gọi API:", response.status);
      }
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8080/obbm/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();

        // Lọc ADMIN và các vai trò liên quan đến STAFF
        const fillterRoles = data?.result?.filter((role) =>
          role.name.startsWith("STAFF")
        );

        setRoles(fillterRoles); // Lưu danh sách vai trò
      } else {
        console.error("Failed to fetch roles:", response.status);
      }
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPergroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/obbm/perGroup`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Nhóm quyền: ", data);
        setPergroups(data?.result); // Lưu danh sách pergroup
      } else {
        console.error("Failed to fetch pergroup:", response.status);
      }
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Error fetching pergroup:", error);
    }
  };

  // Khi chọn vai trò
  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);

    // Lấy danh sách quyền của vai trò được chọn
    const selectedRole = roles.find((role) => role.name === roleName);

    // Cập nhật danh sách quyền đã chọn từ vai trò
    if (selectedRole && selectedRole.permissions) {
      setSelectedPermissions(selectedRole.permissions); // Gán toàn bộ quyền của vai trò
    } else {
      setSelectedPermissions([]); // Nếu không có quyền nào, reset
    }
  };

  // Khi checkbox của permission thay đổi
  const handlePermissionToggle = (permissionName) => {
    setSelectedPermissions((prevPermissions) => {
      const isPermissionSelected = prevPermissions.some(
        (perm) => perm.name === permissionName
      );

      if (isPermissionSelected) {
        // Nếu quyền đã có trong danh sách, loại bỏ nó
        return prevPermissions.filter((perm) => perm.name !== permissionName);
      } else {
        // Nếu quyền chưa có, thêm nó vào danh sách
        return [...prevPermissions, { name: permissionName }];
      }
    });
  };

  // Xử lý khi nhấp vào hàng
  const handleRowClick = (user) => {
    setExpandedUser(expandedUser === user ? null : user); // Đóng lại nếu nhấp vào người dùng đang mở
    setSelectedUserId(user.userId); // Cập nhật ID người dùng được chọn
    setSelectedTab(0); // Đặt tab mặc định là "Thông tin"

    // Lấy vai trò của người dùng từ mảng roles
    const userRole = user.roles.find((role) => role.name.startsWith("STAFF")); // Lọc lấy vai trò có tên bắt đầu bằng "STAFF"
    setSelectedRole(userRole ? userRole.name : ""); // Gán vai trò vào selectRole (nếu có)

    // Nếu có quyền liên quan đến vai trò, lấy quyền của người dùng đó
    if (userRole && userRole.permissions) {
      setSelectedPermissions(userRole.permissions);
    } else {
      setSelectedPermissions([]); // Nếu không có quyền, reset
    }
  };

  // Xử lý chuyển tab
  const handleTabChange = (event, newValue) => setSelectedTab(newValue);

  // Xử lý cập nhật người dùng
  const handleUpdateUser = async () => {
    console.log("User ID:", selectedUserId);
    console.log("Selected Role:", selectedRole);
    console.log("Selected Permissions:", selectedPermissions);

    if (!selectedUserId) {
      alert("Vui lòng chọn người dùng!");
      return;
    }

    const payload = {
      userId: selectedUserId,
      roleNames: selectedRole ? [selectedRole] : [],
      permissionNames: selectedPermissions.map((perm) => perm.name),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/obbm/user-role-permission",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        showSuccess("Cập nhật quyền cho người dùng thành công!");
      } else {
        console.error("Lỗi khi cập nhật quyền:", response.status);
      }
    } catch (error) {
      checkAccessToken(navigate);
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Hàm cập nhật danh sách người dùng khi thêm
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <Box p={3} sx={{ padding: "1px" }}>
      <SnackBarNotification
        open={snackBarOpen}
        handleClose={handleCloseSnackBar}
        message={snackBarMessage}
        snackType={snackType}
      />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <AddUserStaff onUserAdded={handleUserAdded} />
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <React.Fragment key={user.userId}>
                {/* Hàng chính hiển thị thông tin cơ bản */}
                <TableRow
                  key={user.userId || index}
                  onClick={() => handleRowClick(user)}
                  style={{ cursor: "pointer" }}
                  sx={{
                    "&:hover": { backgroundColor: "#eaf4ff" },
                    backgroundColor:
                      expandedUser === user ? "#eaf4ff" : "inherit",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
                {/* Hàng mở rộng hiển thị chi tiết */}
                {expandedUser === user && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
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
                            {user?.username?.toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Tên người dùng:</strong>{" "}
                            {user?.fullname?.toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Điện thoại:</strong>{" "}
                            {user.phone || "Không có thông tin"}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Ngày sinh:</strong>{" "}
                            {user.dob || "Không có thông tin"}
                          </Typography>
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            <strong>Email:</strong>{" "}
                            {user.email || "Không có thông tin"}
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
                          <Box>
                            <Box display="flex" alignItems="center" mb={3}>
                              <InputLabel
                                id="role-select-label"
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#1976d2",
                                  marginRight: "5px",
                                }}
                              >
                                Vai trò:
                              </InputLabel>
                              <FormControl
                                size="small"
                                variant="outlined"
                                sx={{ width: "50%" }}
                              >
                                <Select
                                  value={selectedRole}
                                  onChange={(e) => handleRoleSelect(e.target.value)}
                                  displayEmpty
                                  renderValue={(selected) => {
                                    if (!selected) {
                                      return <em>Chọn vai trò</em>;
                                    }
                                    return roles.find((role) => role.name === selected)?.description;
                                  }}
                                  sx={{
                                    fontSize: "12px",
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: "#f1f1f1", // Nền của input
                                      borderRadius: "8px", // Thêm border-radius
                                      "&:hover": {
                                        backgroundColor: "#e3f2fd", // Nền khi hover
                                      },
                                      "&.Mui-focused": {
                                        backgroundColor: "#fff", // Nền khi focus
                                      },
                                    },
                                  }}
                                >
                                  <MenuItem value="" sx={{ fontSize: "12px" }}>
                                    <span>--- Chọn vai trò ---</span>
                                  </MenuItem>
                                  {/* Đổ dữ liệu từ state */}
                                  {roles
                                    .filter((role) => role.name.includes("STAFF"))
                                    .map((role) => (
                                      <MenuItem key={role.name} value={role.name} sx={{ fontSize: "12px" }}>
                                        {role.description}
                                      </MenuItem>
                                    ))}
                                </Select>

                              </FormControl>
                              <Button variant="contained" sx={{ ml: 2 }} onClick={handleOpenModal}>
                                Thêm
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{ ml: 2 }}
                                onClick={handleOpenConfirmDialog}
                              >
                                Xóa
                              </Button>

                            </Box>

                            {/* Dialog Thêm Role Mới */}
                            <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
                              <DialogTitle>Thêm Vai Trò Mới</DialogTitle>
                              <DialogContent>
                                {/* Input Tên Role */}
                                <TextField
                                  label="Tên Vai Trò"
                                  fullWidth
                                  margin="normal"
                                  name="name"
                                  value={newRole.name}
                                  onChange={handleRoleInputChange}
                                  required
                                />
                                {/* Input Mô Tả */}
                                <TextField
                                  label="Mô Tả"
                                  fullWidth
                                  margin="normal"
                                  name="description"
                                  value={newRole.description}
                                  onChange={handleRoleInputChange}
                                  required
                                />

                                {/* Danh sách Permissions */}
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#1976d2",
                                    mt: 2,
                                    mb: 1,
                                  }}
                                >
                                  Chọn Quyền:
                                </Typography>
                                <Box
                                  display="grid"
                                  gridTemplateColumns="repeat(5, 1fr)"  // Thiết lập 5 cột trên mỗi hàng
                                  gap={3}
                                >
                                  {perGroups.map((group) => (
                                    <Box key={group.name}>
                                      <Typography
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                          backgroundColor: "#e3f2fd", // Background của Summary
                                          borderRadius: "8px", // Border cho Summary
                                          "&:hover": { backgroundColor: "#bbdefb" },
                                          transition: "background-color 0.3s ease", // Hiệu ứng hover mượt mà
                                          padding: "12px 16px", // Padding cho Summary
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            fontWeight: "bold",
                                            color: "#1976d2", // Màu của tiêu đề
                                            marginBottom: "0px",
                                            textTransform: "uppercase", // Chữ in hoa cho tiêu đề
                                          }}
                                        >
                                          {group.description}
                                        </Typography>
                                      </Typography>

                                      <List dense>
                                        {group.listPermission.map((perm) => (
                                          <ListItem key={perm.name}>
                                            <ListItemIcon>
                                              <Checkbox
                                                checked={selectedPermissions.some(
                                                  (p) => p.name === perm.name
                                                )}
                                                onChange={() => handlePermissionToggle(perm.name)}
                                                sx={{
                                                  "& .MuiSvgIcon-root": {
                                                    color: "#1976d2", // Màu của checkbox
                                                  },
                                                }}
                                              />
                                            </ListItemIcon>
                                            <Typography
                                              sx={{
                                                fontSize: "1.2rem", // Kích thước chữ
                                                fontWeight: "normal",
                                                color: "#424242", // Màu chữ
                                              }}
                                            >
                                              {perm.description}
                                            </Typography>
                                          </ListItem>
                                        ))}
                                      </List>
                                    </Box>
                                  ))}
                                </Box>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleCloseModal} color="secondary">
                                  Hủy
                                </Button>
                                <Button
                                  onClick={handleAddRole}
                                  color="primary"
                                  variant="contained"
                                  disabled={!newRole.name || !newRole.description}
                                >
                                  Thêm
                                </Button>
                              </DialogActions>
                            </Dialog>

                            <Dialog
                              open={openConfirmDialog}
                              onClose={handleCloseConfirmDialog}
                              aria-labelledby="confirm-delete-dialog"
                              sx={{
                                "& .MuiDialog-paper": {
                                  borderRadius: "12px", // Góc bo tròn
                                  padding: "16px", // Khoảng cách bên trong
                                  backgroundColor: "#f9f9f9", // Màu nền dialog
                                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // Bóng
                                  maxWidth: "600px", // Độ rộng tối đa
                                  width: "100%",
                                },
                              }}
                            >
                              <DialogTitle
                                id="confirm-delete-dialog"
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "1.5rem",
                                  textAlign: "center",
                                  color: "#d32f2f", // Màu đỏ nổi bật
                                }}
                              >
                                Xác nhận xóa
                              </DialogTitle>
                              <DialogContent
                                sx={{
                                  textAlign: "center",
                                  fontSize: "1.2rem",
                                  color: "#424242", // Màu chữ xám đậm
                                  marginTop: "8px",
                                }}
                              >
                                <Typography>Bạn có chắc chắn muốn xóa vai trò <b>"{selectedRole}"</b> không?</Typography>
                              </DialogContent>
                              <DialogActions
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "16px", // Khoảng cách giữa các nút
                                  paddingBottom: "16px",
                                }}
                              >
                                <Button
                                  onClick={handleCloseConfirmDialog}
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#424242",
                                    backgroundColor: "#e0e0e0", // Nền xám
                                    "&:hover": {
                                      backgroundColor: "#bdbdbd", // Nền khi hover
                                    },
                                    fontSize: "1rem",
                                    padding: "8px 24px", // Kích thước nút
                                    borderRadius: "8px",
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  onClick={handleConfirmDelete}
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#fff",
                                    backgroundColor: "#d32f2f", // Nền đỏ
                                    "&:hover": {
                                      backgroundColor: "#c62828", // Nền khi hover
                                    },
                                    fontSize: "1rem",
                                    padding: "8px 24px", // Kích thước nút
                                    borderRadius: "8px",
                                  }}
                                >
                                  Xóa
                                </Button>
                              </DialogActions>
                            </Dialog>
                            {/* Hiển thị nhóm quyền */}
                            <Box
                              display="grid"
                              gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                              gap={3}
                            >
                              {perGroups.map((group) => (
                                <Box key={group.name}>
                                  <Typography
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                      backgroundColor: "#e3f2fd", // Background của Summary
                                      borderRadius: "8px", // Border cho Summary
                                      "&:hover": { backgroundColor: "#bbdefb" },
                                      transition: "background-color 0.3s ease", // Hiệu ứng hover mượt mà
                                      padding: "12px 16px", // Padding cho Summary
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#1976d2", // Màu của tiêu đề
                                        marginBottom: "0px",
                                        textTransform: "uppercase", // Chữ in hoa cho tiêu đề
                                      }}
                                    >
                                      {group.description}
                                    </Typography>
                                  </Typography>

                                  <List dense>
                                    {group.listPermission.map((perm) => (
                                      <ListItem key={perm.name}>
                                        <ListItemIcon>
                                          <Checkbox
                                            checked={selectedPermissions.some(
                                              (p) => p.name === perm.name
                                            )}
                                            onChange={() =>
                                              handlePermissionToggle(perm.name)
                                            }
                                            sx={{
                                              "& .MuiSvgIcon-root": {
                                                color: "#1976d2", // Màu của checkbox
                                              },
                                            }}
                                          />
                                        </ListItemIcon>
                                        <Typography
                                          sx={{
                                            fontSize: "1.2rem", // Kích thước chữ
                                            fontWeight: "normal",
                                            color: "#424242", // Màu chữ
                                          }}
                                        >
                                          {perm.description}
                                        </Typography>
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Nút hành động */}
                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ fontSize: "1.2rem", textTransform: "none" }}
                          onClick={handleUpdateUser}
                        >
                          Cập nhật quyền
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ fontSize: "1.2rem", textTransform: "none" }}
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
