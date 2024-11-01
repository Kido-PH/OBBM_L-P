import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  IconButton,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import html2pdf from "html2pdf.js";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-toastify";
import {} from "date-fns";
import ReactPaginate from "react-paginate";
import contractApi from "../../api/contractApi";

const ManageContracts = () => {
  const [contracts, setContracts] = useState([]); // Dữ liệu hợp đồng
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [filterPaymentStatus, setFilterPaymentStatus] = useState(""); // Trạng thái lọc PaymentStatus
  const [filterContractType, setFilterContractType] = useState(""); // Trạng thái lọc ContractType
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [showModalPDF, setShowModalPDF] = useState(false);
  const [selecterContract, setSelecterContract] = useState();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelContractId, setCancelContractId] = useState(null); // Lưu ID hợp đồng cần hủy
  const [page, setPage] = useState(1);
  const SIZE_CONTRACT = 5;
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzMwNDY1ODU5LCJpYXQiOjE3MzA0NjQwNTksImp0aSI6IjQwZTQxNzIyLTZlY2MtNDg3Ni04MGE5LWU4ODM5NGM5MzlhYiIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.COtk4hFVa6RfsHFYLkuoJOoI9DawW7CqxNpuPWswzvBbfdgaMzgGh2WHQ27xIXVAdBN9KS1H8AqAkMFwcNgXnA";
    sessionStorage.setItem("token", token);

    fetchContractWithPaginate(page);
  }, []);


  // Hàm lấy tất cả listContract
  const fetchContractWithPaginate = async (page) => {
    try {
      const res = await contractApi.getPaginate(page, SIZE_CONTRACT);
      setContracts(res.result.content);
      setPageCount(res.result.totalPages);
      console.log("res.dt = ", res.result.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    fetchContractWithPaginate(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  // Hiển thị modal chỉnh sửa
  const handleShowModal = (contract) => {
    // setFormData(contract);
    setShowModal(true);
  };
  const handleModalPDF = (contract) => {
    console.log(contract);
    setSelecterContract(contract);
    setShowModalPDF(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowModalPDF(false);
  };

  // Thay đổi dữ liệu trong form
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // Lưu hợp đồng sau khi chỉnh sửa
  // const handleSave = () => {
  //   setContracts(
  //     contracts.map((contract) =>
  //       contract.ContractId === formData.ContractId ? formData : contract
  //     )
  //   );
  //   console.log("Edit contracts sucessfull!");
  //   toast.success("Edit contract successful !");
  //   setShowModal(false); // Đóng modal sau khi lưu
  // };

  // const handleCancelConfirmation = (ContractId) => {
  //   setCancelContractId(ContractId); // Lưu lại ID của hợp đồng cần hủy
  //   setConfirmCancel(true); // Hiển thị hộp thoại xác nhận
  // };

  // Hủy hợp đồng bằng cách cập nhật trạng thái
  const handleCancel = () => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === cancelContractId
          ? { ...contract, ContractStatus: "Cancelled" }
          : contract
      )
    );
    setConfirmCancel(false); // Đóng hộp thoại xác nhận
    toast.success("The contract has been canceled");
  };
  const handleConfirm = (ContractId) => {
    setContracts(
      contracts.map((contract) =>
        contract.ContractId === ContractId
          ? { ...contract, IsConfirmed: true, ContractStatus: "Completed" }
          : contract
      )
    );
    toast.success("The contract has been confirmed");
  };
  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
  };

  const handleSavePDF = () => {
    const contractContent = document.getElementById("contract-content");
    html2pdf().from(contractContent).save();
  };
  const handleSendMail = () => {
    // Lấy địa chỉ email của khách hàng
    // selecterContract lấy tên đại diện hợp đồng mà mình chọn
    const emailTo = selecterContract.CustomerEmail;

    // Lấy nội dung HTML của hợp đồng
    const contractHtml = document.getElementById("contract-content").innerHTML;

    // apiUrl chứa địa chỉ API gửi request POST đến để gửi email
    const apiUrl = "http://emailserivce.somee.com/Email/sendMail";

    // Create the data object
    const data = {
      // Địa chỉ email của KH lấy ở trên
      emailTo: emailTo,
      // Content HTML của HĐ (dùng làm content email)
      template: contractHtml,
    };

    // Send the POST request to the API
    // axios.post(apiUrl, data) Gửi y/c POST đến apiUrl với dữ liệu data
    // Nếu thành công thì hàm trong then thực thi
    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log("Email sent successfully:", response.data);
        alert("Email đã được gửi thành công!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Gửi email thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <div>
      {/* Tìm kiếm và lọc */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2, // margin bottom
        }}
      >
        {/* Ô tìm kiếm */}
        <div className="admin-group">
          <svg
            className="admin-icon-search"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Search"
            type="search"
            className="admin-input-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bộ lọc theo PaymentStatus */}
        <FormControl
          sx={{
            width: "200px",
            maxHeight: "30px",
          }}
        >
          <InputLabel sx={{ color: "#555" }}>Payment Status</InputLabel>
          <Select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            label="Payment Status"
            sx={{
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="">
              <span role="img" aria-label="All">
                🔄
              </span>
              &nbsp; All
            </MenuItem>
            <MenuItem value="Paid">
              <span role="img" aria-label="Paid">
                💸
              </span>
              &nbsp; Paid
            </MenuItem>
            <MenuItem value="Pending">
              <span role="img" aria-label="Pending">
                ⏳
              </span>
              &nbsp; Pending
            </MenuItem>
            <MenuItem value="Unpaid">
              <span role="img" aria-label="Unpaid">
                🚫
              </span>
              &nbsp; Unpaid
            </MenuItem>
          </Select>
        </FormControl>

        {/* Bộ lọc theo ContractType */}
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Contract Type</InputLabel>
          <Select
            value={filterContractType}
            onChange={(e) => setFilterContractType(e.target.value)}
            label="Contract Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Rental">Rental</MenuItem>
            <MenuItem value="Consulting">Consulting</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên hợp đồng</TableCell>
              <TableCell>Loại tiệc</TableCell>
              <TableCell>Số lượng khách</TableCell>
              <TableCell>Số bàn</TableCell>
              <TableCell>Tổng chi phí</TableCell>
              <TableCell>Trạng thái hợp đồng</TableCell>
              <TableCell>Trạng thái thanh toán</TableCell>
              <TableCell>Ngày tổ chức</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          {/* Nội dung contracts */}
          <TableBody>
            {contracts.map((contract, index) => (
                <TableRow key={contract.contractId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{contract.guest}</TableCell>
                  <TableCell>{contract.table}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(contract.totalcost)}</TableCell>
                  <TableCell>{contract.status}</TableCell>
                  <TableCell>{contract.paymentstatus}</TableCell>
                  <TableCell>
                    {new Date(contract.organizdate).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                  </TableCell>
                  <TableCell>{contract.description}</TableCell>
                  <TableCell>{contract.custname}</TableCell>
                  <TableCell>{contract.custphone}</TableCell>
                  <TableCell>{contract.custmail}</TableCell>
                  <TableCell
                    sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleShowModal(contract)}
                      sx={{ justifyContent: "center" }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="success"
                      onClick={() => handleConfirm(contract.ContractId)}
                      sx={{ justifyContent: "center" }}
                      disabled={
                        contract.ContractStatus === "Pending" ||
                        contract.ContractStatus === "Completed" ||
                        contract.PaymentStatus === "Pending"
                      }
                    >
                      <CheckCircleIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      // onClick={() =>
                      //   handleCancelConfirmation(contract.ContractId)
                      // }
                      sx={{ justifyContent: "center" }}
                      disabled={
                        contract.ContractStatus === "Pending" ||
                        contract.PaymentStatus === "Pending"
                      }
                    >
                      <CancelIcon />
                    </IconButton>

                    {/* New Info IconButton */}
                    <IconButton
                      color="info"
                      onClick={() => handleModalPDF(contract)}
                      sx={{ justifyContent: "center" }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Phân trang */}
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />

      </TableContainer>
      {/* Modal chỉnh sửa hợp đồng */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle
          sx={{ fontSize: "1.6rem", color: "#FFA500", fontWeight: "bold" }}
        >
          Edit Contract
        </DialogTitle>
        <DialogContent className="custom-input">
          <TextField
            label="Username"
            name="Username"
            // value={formData.Username}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="EventId"
            name="EventId"
            type="number"
            // value={formData.EventId}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="OrganizDate"
            name="OrganizDate"
            type="datetime-local"
            // value={formData.OrganizDate}
            // onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="LocationId"
            name="LocationId"
            // value={formData.LocationId}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="ContractType"
            name="ContractType"
            // value={formData.ContractType}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="TotalMoney"
            name="TotalMoney"
            type="number"
            // value={formData.TotalMoney}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="PaymentStatus"
            name="PaymentStatus"
            // value={formData.PaymentStatus}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Contract Status</InputLabel>
            <Select
              label="Contract Status"
              name="ContractStatus"
              // value={formData.ContractStatus}
              // onChange={handleChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            name="Description"
            // value={formData.Description}
            // onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerName"
            name="CustomerName"
            // value={formData.CustomerName}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerPhone"
            name="CustomerPhone"
            // value={formData.CustomerPhone}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="CustomerEmail"
            name="CustomerEmail"
            type="email"
            // value={formData.CustomerEmail}
            // onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Close
          </Button>
          <Button
            // onClick={handleSave}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>{" "}
      {/* Modal xác nhận hủy hộp đồng */}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ color: "error.main", mr: 1 }} />
          Cancel Contract
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1.6rem" }}>
            Are you sure you want to cancel this contract?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmCancel(false)}
            color="secondary"
            sx={{ fontSize: "1.5rem" }}
          >
            Close
          </Button>
          <Button
            onClick={handleCancel}
            color="primary"
            sx={{ fontSize: "1.5rem" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showModalPDF} onClose={handleCloseModal}>
        <DialogTitle
          sx={{ fontSize: "1.6rem", color: "#FFA500", fontWeight: "bold" }}
        >
          Hợp Đồng Dịch Vụ
        </DialogTitle>
        <DialogContent className="custom-input">
          <div
            id="contract-content"
            style={{
              padding: "20px",
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.6,
            }}
          >
            <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
              Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam
            </h2>
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              Độc lập - Tự do - Hạnh phúc
            </p>
            <h3 style={{ textAlign: "center", marginTop: "20px" }}>
              Hợp Đồng Dịch Vụ
            </h3>

            <p style={{ textAlign: "right" }}>
              Số hợp đồng: <strong>{selecterContract?.EventId || "..."}</strong>
            </p>

            <p style={{ marginTop: "20px" }}>
              Căn cứ Bộ luật Dân sự 2015 số 91/2015/QH13 và các văn bản hướng
              dẫn thi hành;
            </p>
            <p>
              Căn cứ nhu cầu và thỏa thuận giữa các bên, hôm nay, vào ngày{" "}
              <strong>
                {selecterContract?.OrganizDate
                  ? new Date(selecterContract.OrganizDate).getDate()
                  : "..."}
              </strong>{" "}
              tháng{" "}
              <strong>
                {selecterContract?.OrganizDate
                  ? new Date(selecterContract.OrganizDate).getMonth() + 1
                  : "..."}
              </strong>{" "}
              năm{" "}
              <strong>
                {selecterContract?.OrganizDate
                  ? new Date(selecterContract.OrganizDate).getFullYear()
                  : "..."}
              </strong>
              , tại trụ sở Công ty ...
            </p>

            <h3>
              Bên A:{" "}
              <strong>{selecterContract?.Username || "(Bên Thuê)"}</strong>
            </h3>
            <p>
              <strong>Địa chỉ trụ sở:</strong>{" "}
              {selecterContract?.Address || "Địa chỉ của bên A"}
            </p>
            <p>
              <strong>Mã số thuế:</strong> {selecterContract?.TaxCode || "..."}
            </p>
            <p>
              <strong>Đại diện là Ông/Bà:</strong>{" "}
              {selecterContract?.Username || "..."}
            </p>
            <p>
              <strong>Chức vụ:</strong> {selecterContract?.Position || "..."}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {selecterContract?.custphone || "0123456789"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selecterContract?.custmail || "example@example.com"}
            </p>
            <p>
              <strong>Số tài khoản ngân hàng:</strong>{" "}
              {selecterContract?.BankAccount || "123456789"} tại Ngân hàng:{" "}
              {selecterContract?.BankName || "ABC"}
            </p>

            <h3>
              Bên B: <strong>Freelancer (Bên Cung Cấp Dịch Vụ)</strong>
            </h3>
            <p>
              <strong>Số CMND/CCCD:</strong>{" "}
              {selecterContract?.IDCard || "123456789"}, cấp ngày ... tại ...
            </p>
            <p>
              <strong>Sinh ngày:</strong>{" "}
              {selecterContract?.Birthday || "01/01/1990"}
            </p>
            <p>
              <strong>Địa chỉ thường trú:</strong>{" "}
              {selecterContract?.Address || "Địa chỉ của bên B"}
            </p>
            <p>
              <strong>Địa chỉ liên hệ:</strong>{" "}
              {selecterContract?.ContactAddress || "..."}
            </p>

            <h3>Điều 1: Nội dung hợp đồng</h3>
            <p>
              Bên A đồng ý thuê Bên B cung cấp dịch vụ{" "}
              {selecterContract?.ContractType || "dịch vụ"} tại địa điểm số{" "}
              <strong>{selecterContract?.LocationId || "..."}</strong> vào ngày{" "}
              <strong>
                {selecterContract?.OrganizDate
                  ? new Date(selecterContract.OrganizDate).toLocaleDateString()
                  : "..."}
              </strong>
              .
            </p>
            <p>Dịch vụ bao gồm: {selecterContract?.Description || "..."}</p>

            <h3>Điều 2: Trách nhiệm và quyền lợi của các bên</h3>
            <p>
              - Bên A có trách nhiệm thanh toán đầy đủ cho Bên B theo tổng số
              tiền đã thoả thuận là{" "}
              <strong>{selecterContract?.TotalMoney || "..."}</strong>, và số
              tiền đã được thanh toán.
            </p>
            <p>
              - Bên B có trách nhiệm cung cấp dịch vụ theo yêu cầu của Bên A.
              Nếu có bất kỳ vấn đề phát sinh nào, các bên sẽ thương lượng để tìm
              cách giải quyết.
            </p>

            <h3>Điều 3: Điều khoản chung</h3>
            <p>
              Hợp đồng có hiệu lực kể từ ngày ký và sẽ kết thúc sau khi dịch vụ
              hoàn thành.
            </p>
            <p>
              Các tranh chấp phát sinh sẽ được giải quyết theo pháp luật Việt
              Nam.
            </p>

            <h3>Chữ ký của các bên</h3>
            <p>
              <strong>Bên A:</strong> ___________________
            </p>
            <p>
              <strong>Bên B:</strong> ___________________
            </p>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Đóng
          </Button>
          <Button
            onClick={handleSavePDF}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Xuất PDF
          </Button>
          <Button
            onClick={handleSendMail}
            color="success"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Gửi Email
          </Button>
        </DialogActions>
      </Dialog>{" "}
    </div>
  );
};

export default ManageContracts;