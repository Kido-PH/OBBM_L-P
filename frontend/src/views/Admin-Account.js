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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
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
      toast.success("Cập nhật thông tin tài khoản thành công!");
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
    toast.success("Cập nhật trạng thái tài khoản thành công!");
  };

  const handleCancelLock = () => {
    setOpenConfirmDialog(false);
    setAccountToLock(null);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm nằm bên trái */}
        <TextField
          label="Search Account"
          variant="outlined"
          sx={{ width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add Account
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
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
            {accounts
              .filter((account) => !account.IsDeleted)
              .map((account) => (
                <TableRow key={account.Username}>
                  <TableCell>{account.Username}</TableCell>
                  <TableCell>{account.Fullname}</TableCell>
                  <TableCell>{account.Email}</TableCell>
                  <TableCell>{account.PhoneNumber}</TableCell>
                  <TableCell>{account.Image}</TableCell>
                  <TableCell>{account.Identity}</TableCell>
                  <TableCell>
                    {new Date(account.DateCreate).toLocaleDateString()}
                  </TableCell>

                  <TableCell
                    className={`${
                      account.AccountStatus ? "text-danger" : "text-success"
                    }`}
                  >
                    {account.AccountStatus ? "Khóa" : "Hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog("edit", account)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleLockClick(account.Username)}
                    >
                      {account.AccountStatus ? "Mở khóa" : "Khóa"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Add Account" : "Edit Account"}
        </DialogTitle>
        <DialogContent>
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
            label="Khóa tài khoản"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelLock}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <p>
            Bạn có chắc chắn muốn{" "}
            {accounts.find((acc) => acc.Username === accountToLock)
              ?.AccountStatus
              ? "mở khóa"
              : "khóa"}{" "}
            tài khoản này?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLock} color="primary">
            Không
          </Button>
          <Button onClick={handleConfirmLock} color="secondary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountManager;
