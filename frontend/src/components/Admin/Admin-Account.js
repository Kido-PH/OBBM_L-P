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
  Checkbox,
  FormControlLabel,
  Box,
  IconButton,
  TablePagination,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import axios from "axios";
import userApi from "api/userApi";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({});
  const [dialogMode, setDialogMode] = useState("add");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [accountToLock, setAccountToLock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch users with empty roles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUser();
        const filteredUsers = response.result?.filter(
          (user) => user.roles.length === 0
        );
        setAccounts(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = (mode, account) => {
    setDialogMode(mode);
    setCurrentAccount(
      account || {
        Username: "",
        Password: "",
        Fullname: "",
        Email: "",
        PhoneNumber: "",
        Image: "",
        Identity: "",
        DateCreate: new Date(),
        AccountStatus: false,
        IsDeleted: false,
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAccount({
      ...currentAccount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      setAccounts([
        ...accounts,
        { ...currentAccount, DateCreate: new Date(), AccountStatus: false },
      ]);
      toast.success("Thêm tài khoản khách hàng thành công!");
    } else if (dialogMode === "edit") {
      setAccounts(
        accounts.map((account) =>
          account.Username === currentAccount.Username
            ? currentAccount
            : account
        )
      );
      toast.success("Account information updated successfully !");
    }
    handleCloseDialog();
  };

  const handleLockClick = (username) => {
    setAccountToLock(username);
    setOpenConfirmDialog(true);
  };

  const handleConfirmLock = () => {
    setAccounts(
      accounts.map((account) =>
        account.Username === accountToLock
          ? { ...account, AccountStatus: !account.AccountStatus }
          : account
      )
    );
    setOpenConfirmDialog(false);
    setAccountToLock(null);
    toast.success("Account status updated successfully !");
  };

  const handleCancelLock = () => {
    setOpenConfirmDialog(false);
    setAccountToLock(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  // Hàm tìm kiếm: Lọc các dịch vụ dựa trên từ khóa tìm kiếm
  const filteredAccounts = accounts
  .filter((accounts) =>
    searchTerm === "" || // Nếu không có từ khóa tìm kiếm
    Object.values(accounts).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  .filter((accounts) => !accounts.Status); // Loại bỏ các dịch vụ có trạng thái 'Status' là true

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm */}
        <div className="admin-group">
          <svg className="admin-icon-search" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
          <input placeholder="Search" type="search" className="admin-input-search" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button
          sx={{fontSize:'10px'}}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add Account
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ mt: 1 }}
        className="table-container"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell >#</TableCell>
              <TableCell >
                Tên đăng nhập
              </TableCell>
              <TableCell >
                Họ tên
              </TableCell>
              <TableCell >
                Email
              </TableCell>
              <TableCell >
                Số điện thoại
              </TableCell>
              <TableCell >
                Trạng thái
              </TableCell>
              <TableCell >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((account, index) => (
                <TableRow key={account.userId}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.fullname}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>
                    {account.noPassword ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>Inactive</span>
                    ) : (
                      <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setOpenDialog(true)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setOpenConfirmDialog(true)}
                    >
                      {account.noPassword ? <LockIcon /> : <LockOpenIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAccounts.length}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontSize: "1.7rem", color: "#FFA500", fontWeight:'bold' }}>
          {dialogMode === "add" ? "Add Account" : "Edit Account"}
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            autoFocus
            margin="dense"
            name="Username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAccount.Username || ""}
            onChange={handleInputChange}
            disabled={dialogMode === "edit"}
          />
          <TextField
            margin="dense"
            name="Password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={currentAccount.Password || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Fullname"
            label="Fullname"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAccount.Fullname || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={currentAccount.Email || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="PhoneNumber"
            label="Phone Number"
            type="number"
            fullWidth
            variant="outlined"
            value={currentAccount.PhoneNumber || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Image"
            label="Image"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAccount.Image || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Identity"
            label="Identity"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAccount.Identity || ""}
            onChange={handleInputChange}
          />{" "}
          <TextField
            margin="dense"
            name="DateCreate"
            label="Date Create"
            type="date"
            fullWidth
            variant="outlined"
            value={currentAccount.DateCreate || ""}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentAccount.AccountStatus}
                onChange={handleInputChange}
                name="AccountStatus"
              />
            }
            label="Lock account"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelLock}>
      <DialogTitle sx={{fontSize:'1.6rem', color: '', display: 'flex', alignItems: 'center'}}>
            <CheckCircleIcon sx={{ color: '#1976d2', mr: 1 }} />
            Do you confirm the change of status ?
        </DialogTitle>
        <DialogContent>
          <p>
             Are you sure you want to{" "}
            {accounts.find((acc) => acc.Username === accountToLock)
              ?.AccountStatus
              ? "active"
              : "inactive"}{" "}
              this account?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLock} color="primary" sx={{fontSize:'1.3rem'}}>
            Close
          </Button>
          <Button onClick={handleConfirmLock} color="secondary" sx={{fontSize:'1.3rem'}}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountManager;