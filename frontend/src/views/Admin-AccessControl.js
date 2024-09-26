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
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Dữ liệu ban đầu của các quyền
const initialRoles = [
  { roleId: "admin", roleName: "Admin", description: "Full system authority" },
  { roleId: "user", roleName: "User", description: "User permissions" },
  { roleId: "staff", roleName: "Staff", description: "Staff" },
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
      tempErrors.roleId = "Permission ID cannot be empty";
      valid = false;
    }
    if (!newRole.roleName.trim()) {
      tempErrors.roleName = "Permission Name cannot be empty";
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
      toast.success("Edit Permissions succesfuly!");
    } else {
      setRoles([...roles, newRole]); // Thêm quyền mới
      toast.success("Add Permissions succesfuly!");
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
    toast.success("Delete Permissions succesfuly!");
    handleDeleteConfirmClose();
  };

  return (
    <Box p={3}>
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage AccessControl
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {/* Nút thêm quyền */}
      <Box mt={2} mb={2}>
        <Button sx={{fontSize:'10px'}} variant="contained" color="primary" onClick={handleDialogOpen}>
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
                    EDIT
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteConfirmOpen(index)}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm quyền */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight:'bold' }}>{isEdit ? "Edit Permission" : "New Permission"}</DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            margin="dense"
            label="ID Permission"
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
            label="Name Permission"
            fullWidth
            name="roleName"
            value={newRole.roleName}
            onChange={handleChange}
            error={!!errors.roleName}
            helperText={errors.roleName}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            name="description"
            value={newRole.description}
            onChange={handleChange}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary" sx={{fontSize:'1.4rem'}}>
            Close
          </Button>
          <Button onClick={handleAddOrEditRole} color="primary" sx={{fontSize:'1.4rem'}}>
            {isEdit ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
      <DialogTitle sx={{fontSize:'1.6rem', color: '#d32f2f', display: 'flex', alignItems: 'center'}}>
            <ErrorOutlineIcon sx={{ color: 'error.main', mr: 1 }} />
            Delete confirmation
        </DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this permission?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="secondary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Close
          </Button>
          <Button onClick={handleDeleteRole} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessControl;
