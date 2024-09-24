import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

// Dữ liệu ban đầu của các quyền
const initialRoles = [
  { roleId: "Admin", roleName: "Admin", description: "Toàn quyền hệ thống" },
  { roleId: "user", roleName: "User", description: "Quyền hạn người dùng" },
  { roleId: "manager", roleName: "Manager", description: "Quản lý" },
];

const AccessControl = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRole, setNewRole] = useState({
    roleId: "",
    roleName: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false); // Xác định xem đang thêm mới hay chỉnh sửa
  const [editIndex, setEditIndex] = useState(null); // Lưu index của quyền đang chỉnh sửa
  const [errors, setErrors] = useState({ roleId: "", roleName: "" }); // Lưu lỗi
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // Đóng/mở dialog xác nhận xóa
  const [deleteIndex, setDeleteIndex] = useState(null); // Lưu index của quyền đang xóa

  // Mở/Đóng Dialog
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewRole({ roleId: "", roleName: "", description: "" });
    setErrors({ roleId: "", roleName: "" });
    setIsEdit(false);
    setEditIndex(null);
  };

  // Xử lý thay đổi thông tin quyền
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  // Xác thực dữ liệu
  const validate = () => {
    let tempErrors = { roleId: "", roleName: "" };
    let valid = true;

    if (!newRole.roleId.trim()) {
      tempErrors.roleId = "ID Quyền không được để trống";
      valid = false;
    }
    if (!newRole.roleName.trim()) {
      tempErrors.roleName = "Tên Quyền không được để trống";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  // Xử lý thêm hoặc sửa quyền
  const handleAddOrEditRole = () => {
    if (!validate()) return; // Nếu có lỗi, không thực hiện thêm/sửa

    if (isEdit && editIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[editIndex] = newRole; // Cập nhật quyền đã sửa
      setRoles(updatedRoles);
      toast.success("Sửa quyền thành công!");
    } else {
      setRoles([...roles, newRole]); // Thêm quyền mới
      toast.success("Thêm quyền thành công!");
    }
    handleDialogClose();
  };

  // Xử lý chỉnh sửa quyền
  const handleEditRole = (index) => {
    setNewRole(roles[index]);
    setIsEdit(true);
    setEditIndex(index);
    handleDialogOpen();
  };

  // Xử lý mở hộp thoại xác nhận xóa
  const handleDeleteConfirmOpen = (index) => {
    setDeleteIndex(index);
    setOpenDeleteConfirm(true); // Mở hộp thoại xác nhận xóa
  };

  // Xử lý đóng hộp thoại xác nhận xóa
  const handleDeleteConfirmClose = () => {
    setOpenDeleteConfirm(false);
    setDeleteIndex(null);
  };

  // Xử lý xóa quyền
  const handleDeleteRole = () => {
    const updatedRoles = roles.filter((_, i) => i !== deleteIndex);
    setRoles(updatedRoles);
    toast.success("Xóa quyền thành công!");
    handleDeleteConfirmClose();
  };

  return (
    <Box p={3}>
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage StockRequests
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {/* Nút thêm quyền */}
      <Box mt={2} sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add New Permission
        </Button>
      </Box>

      {/* Bảng danh sách quyền */}
      <TableContainer component={Paper}>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>Permission ID</TableCell>
              <TableCell>Permission Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow key={index}>
                <TableCell>{role.roleId}</TableCell>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditRole(index)}
                    style={{ marginRight: 8 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteConfirmOpen(index)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm quyền */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEdit ? "Sửa Quyền" : "Thêm Quyền Mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID Quyền"
            fullWidth
            name="roleId"
            value={newRole.roleId}
            onChange={handleChange}
            error={!!errors.roleId}
            helperText={errors.roleId}
            disabled={isEdit} // Không cho phép chỉnh sửa ID khi đang sửa
          />
          <TextField
            margin="dense"
            label="Tên Quyền"
            fullWidth
            name="roleName"
            value={newRole.roleName}
            onChange={handleChange}
            error={!!errors.roleName}
            helperText={errors.roleName}
          />
          <TextField
            margin="dense"
            label="Mô Tả"
            fullWidth
            name="description"
            value={newRole.description}
            onChange={handleChange}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleAddOrEditRole} color="primary">
            {isEdit ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa quyền này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleDeleteRole} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessControl;
