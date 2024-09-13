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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const initialInvoices = [
  {
    InvoiceId: 1,
    ContractId: 1001,
    IssueDate: "2024-01-10T10:00:00",
    DueDate: "2024-01-20T23:59:59",
    PaymentMethod: "Credit Card",
    TotalAmount: 1500.5,
    InvoiceContent: "Payment for web development services",
    Status: "Pending",
  },
  {
    InvoiceId: 2,
    ContractId: 1002,
    IssueDate: "2024-02-05T09:30:00",
    DueDate: "2024-02-15T23:59:59",
    PaymentMethod: "Bank Transfer",
    TotalAmount: 2300,
    InvoiceContent: "Payment for mobile app development",
    Status: "Paid",
  },
];

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState({
    InvoiceId: "",
    ContractId: "",
    IssueDate: "",
    DueDate: "",
    PaymentMethod: "",
    TotalAmount: "",
    InvoiceContent: "",
    Status: "Pending",
  });
  const [dialogMode, setDialogMode] = useState("add");

  const handleOpenDialog = (mode, invoice) => {
    setDialogMode(mode);
    setCurrentInvoice(
      invoice || {
        InvoiceId: "",
        ContractId: "",
        IssueDate: "",
        DueDate: "",
        PaymentMethod: "",
        TotalAmount: "",
        InvoiceContent: "",
        Status: "Pending",
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvoice({ ...currentInvoice, [name]: value });
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      setInvoices([
        ...invoices,
        { ...currentInvoice, InvoiceId: invoices.length + 1 },
      ]);
      toast.success("Thêm hóa đơn thành công!");
    } else if (dialogMode === "edit") {
      setInvoices(
        invoices.map((invoice) =>
          invoice.InvoiceId === currentInvoice.InvoiceId
            ? currentInvoice
            : invoice
        )
      );
      toast.success("Cập nhật hóa đơn thành công!");
    }
    handleCloseDialog();
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
          label="Search Invoice"
          variant="outlined"
          sx={{ width: "300px" }}
        />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("add")}
      >
        Add Invoice
      </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Mã hợp đồng</TableCell>
              <TableCell>Ngày xuất</TableCell>
              <TableCell>Ngày đến hạn</TableCell>
              <TableCell>Phương thức thanh toán</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.InvoiceId}>
                <TableCell>{invoice.InvoiceId}</TableCell>
                <TableCell>{invoice.ContractId}</TableCell>
                <TableCell>
                  {new Date(invoice.IssueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(invoice.DueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.PaymentMethod}</TableCell>
                <TableCell>{invoice.TotalAmount}</TableCell>
                <TableCell>{invoice.InvoiceContent}</TableCell>
                <TableCell>{invoice.Status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog("edit", invoice)}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Thêm hóa đơn" : "Sửa hóa đơn"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="ContractId"
            label="Mã hợp đồng"
            type="number"
            fullWidth
            variant="outlined"
            value={currentInvoice.ContractId || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="IssueDate"
            label="Ngày xuất"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={currentInvoice.IssueDate || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="DueDate"
            label="Ngày đến hạn"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={currentInvoice.DueDate || ""}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              name="PaymentMethod"
              value={currentInvoice.PaymentMethod || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="Credit Card">Thẻ tín dụng</MenuItem>
              <MenuItem value="Bank Transfer">Chuyển khoản</MenuItem>
              <MenuItem value="PayPal">PayPal</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="TotalAmount"
            label="Số tiền"
            type="number"
            fullWidth
            variant="outlined"
            value={currentInvoice.TotalAmount || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="InvoiceContent"
            label="Nội dung hóa đơn"
            type="text"
            fullWidth
            variant="outlined"
            value={currentInvoice.InvoiceContent || ""}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="Status"
              value={currentInvoice.Status || "Pending"}
              onChange={handleInputChange}
            >
              <MenuItem value="Pending">Chưa thanh toán</MenuItem>
              <MenuItem value="Paid">Đã thanh toán</MenuItem>
              <MenuItem value="Overdue">Quá hạn</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoiceManager;