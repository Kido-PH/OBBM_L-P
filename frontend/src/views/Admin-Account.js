import React, { useState } from "react";
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
  Typography,
  Divider,
  IconButton,
  TablePagination,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { initialAccounts } from "../components/data";

const AccountManager = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({
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
  });
  const [dialogMode, setDialogMode] = useState("add");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [accountToLock, setAccountToLock] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang

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
      <Typography variant="h2" sx={{ mb: 2, color: "orange" }}>
        Manage Customer Account
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Account"
          variant="outlined"
          sx={{ width: "300px" }}
          value={searchTerm} // Liên kết với searchTerm
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng nhập liệu
        />
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
              <TableCell>Username</TableCell>
              <TableCell>Fullname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>PhoneNumber</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>DateCreate</TableCell>
              <TableCell>Account Status</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts
              .filter((account) => !account.IsDeleted)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Chỉ lấy các mục cho trang hiện tại
              .map((account) => (
                <TableRow key={account.Username}>
                  <TableCell>{account.Username}</TableCell>
                  <TableCell>{account.Fullname}</TableCell>
                  <TableCell>{account.Email}</TableCell>
                  <TableCell>{account.PhoneNumber}</TableCell>
                  <TableCell>{account.Image}</TableCell>
                  <TableCell>{account.Identity}</TableCell>
                  <TableCell>
                    {new Date(account.DateCreate).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                    {new Date(account.DateCreate).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: account.AccountStatus ? "red" : "green",
                      alignItems: "center",
                    }}
                  >
                    {account.AccountStatus ? (
                      <>
                        <CancelIcon sx={{ color: "red" }} />{" "}
                        <span>Inactive</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />{" "}
                        <span>Active</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="large"
                      color="primary"
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", account)}
                      style={{ marginRight: "10px" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleLockClick(account.Username)}
                    >
                      {account.AccountStatus ? (
                        <LockOpenIcon sx={{ color: "green" }} /> // Icon mở khóa cho trạng thái hoạt động
                      ) : (
                        <LockIcon sx={{ color: "red" }} /> // Icon khóa cho trạng thái không hoạt động
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={accounts.length}
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