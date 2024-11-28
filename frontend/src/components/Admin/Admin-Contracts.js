import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import html2pdf from "html2pdf.js";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast, Toaster } from "react-hot-toast";
import { format, parse } from "date-fns";
import contractApi from "../../api/contractApi";
import ContractFilter from "./ContractFilter";

const ManageContracts = () => {
  const [contracts, setContracts] = useState([]); // Dữ liệu hợp đồng
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [showModalPDF, setShowModalPDF] = useState(false);
  const [selecterContract, setSelecterContract] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Bạn có thể thay đổi số mục trên mỗi trang
  const [totalElements, setTotalElements] = useState(0);

  const [selectedContractStatus, setSelectedContractStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  useEffect(() => {
    fetchContractWithPaginate(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);
  // Hàm lấy tất cả listContract
  const fetchContractWithPaginate = async (page, rowsPerPage) => {
    try {
      const res = await contractApi.getPaginate(page, rowsPerPage);
      setContracts(res.result?.content);
      setTotalElements(res.result?.totalElements);
      console.log(res.result?.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ duyệt";
      case "Approved":
        return "Đã duyệt";
      case "Actived":
        return "Đang hoạt động";
      case "Completed":
        return "Đã hoàn thành";
      case "Unpaid":
        return "Chưa thanh toán";
      case "Prepay 50%":
        return "Trả trước 50%";
      case "Prepay 70%":
        return "Trả trước 70%";
      case "Paid":
        return "Đã thanh toán";
      default:
        return status; // Nếu không có giá trị hợp lệ, trả lại trạng thái gốc
    }
  };

  // Hàm xử lý xác nhận hợp đồng
  const handleConfirmContract = async (contract) => {
    // Kiểm tra trạng thái hợp đồng "Chờ duyệt" và "Chưa thanh toán"
    if (contract.status === "Pending" && contract.paymentstatus === "Unpaid") {
      toast.error("Hợp đồng chưa được thanh toán, không thể kích hoạt.");
      return;
    }
  
    // Kiểm tra trạng thái "Chờ duyệt" với thanh toán trước một phần (50% hoặc 70%)
    if (contract.status === "Pending" && (contract.paymentstatus === "Prepay 50%" || contract.paymentstatus === "Prepay 70%")) {
      contract.status = "Actived"; // Đổi trạng thái thành "Đang hoạt động"
      toast.success(`Hợp đồng đã được kích hoạt với phần trăm thanh toán: ${translateStatus(contract.paymentstatus)}`);
    }
  
    // Trường hợp hợp đồng "Đã duyệt" và "Đã thanh toán"
    else if (contract.status === "Approved" && contract.paymentstatus === "Paid") {
      contract.status = "Completed"; // Đổi trạng thái thành "Đã hoàn thành"
      toast.success("Hợp đồng đã được xác nhận và hoàn thành!");
    }
  
    // Trường hợp hợp đồng đã hoàn thành và đã thanh toán đầy đủ
    else if (contract.status === "Completed" && contract.paymentstatus === "Paid") {
      toast.success("Hợp đồng đã hoàn thành và đã được xác nhận trước đó!");
    }
  
    // Trường hợp không thỏa mãn các điều kiện trên
    else {
      toast.error("Phải thanh toán đầy đủ hoặc hợp đồng phải được duyệt mới có thể xác nhận!");
      return;
    }
  
    // Chuẩn bị dữ liệu gửi lên API để cập nhật
    const data = {
      name: contract.name,
      type: contract.type,
      guest: contract.guest,
      table: contract.table,
      totalcost: contract.totalcost,
      status: contract.status,
      paymentstatus: contract.paymentstatus,
      organizdate: contract.organizdate, // Định dạng ISO 8601
      custname: contract.custname,
      custphone: contract.custphone,
      description: contract.description,
      userId: contract.users.userId,
      locationId: contract.locations.locationId,
      eventId: contract.events.eventId,
      menuId: contract.menus.menuId,
    };
  
    console.log("Dữ liệu gửi lên API:", data);
  
    try {
      // Gọi API PUT để cập nhật hợp đồng
      const res = await contractApi.update(contract.contractId, data);
      console.log("Phản hồi từ API:", res);
      
      // Kiểm tra mã trạng thái trả về từ server
      if (res.code === 1000) {
        fetchContractWithPaginate(page); // Làm mới danh sách hợp đồng sau khi cập nhật
        toast.success("Cập nhật hợp đồng thành công!");
      } else {
        toast.error("Cập nhật hợp đồng không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận hợp đồng:", error);
      if (error.response) {
        console.error("Phản hồi lỗi từ server:", error.response.data);
      }
      toast.error("Không thể xác nhận hợp đồng. Vui lòng thử lại sau!");
    }
  };
  

  // Hàm hủy hợp đồng
  const handleCancelContract = async (contract) => {
    try {
      const updateData = {
        name: contract.name,
        type: contract.type,
        guest: contract.guest,
        table: contract.table,
        totalcost: contract.totalcost,
        status: "Đã hủy",
        paymentstatus: contract.paymentstatus,
        organizdate: contract.organizdate, // Định dạng ISO 8601
        custname: contract.custname,
        custphone: contract.custphone,
        description: contract.description,
        userId: contract.users.userId,
        locationId: contract.locations.locationId,
        eventId: contract.events.eventId,
        menuId: contract.menus.menuId,
      };

      // Gọi API POST để hủy hợp đồng
      const res = await contractApi.update(contract.contractId, updateData);
      if (res.code === 1000) {
        fetchContractWithPaginate(page);
        toast.success("Hợp đồng đã được hủy thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi hủy hợp đồng:", error);
      toast.error("Không thể hủy hợp đồng. Vui lòng thử lại sau!");
    }
  };

  // Hàm xử lý tìm kiếm theo từ khóa
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearchTerm = searchTerm
      ? contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.paymentstatus.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesContractStatus = selectedContractStatus
      ? contract.status.toLowerCase() === selectedContractStatus.toLowerCase()
      : true;

    const matchesPaymentStatus = selectedPaymentStatus
      ? contract.paymentstatus.toLowerCase() ===
        selectedPaymentStatus.toLowerCase()
      : true;

    // Kết hợp tất cả điều kiện
    return matchesSearchTerm && matchesContractStatus && matchesPaymentStatus;
  });

  const handleChangePage = (event, newPage) => {
    console.log("check page: ", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModalPDF = (contract) => {
    console.log(contract);
    setSelecterContract(contract);
    setShowModalPDF(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowModalPDF(false);
  };

  const handleSavePDF = () => {
    const contractContent = document.getElementById("contract-content");
    html2pdf().from(contractContent).save();
  };

  const handleSendMail = () => {
    const emailTo = selecterContract?.custmail;

    // Lấy nội dung HTML của hợp đồng
    const contractHtml = document.getElementById("contract-content").innerHTML;

    // apiUrl chứa địa chỉ API gửi request POST đến để gửi email
    const apiUrl = "http://emailserivce.somee.com/Email/sendMail";

    const data = {
      emailTo: emailTo,
      template: contractHtml,
    };

    axios
      .post(apiUrl, data)
      .then((response) => {
        toast.success("Email đã được gửi thành công!");
      })
      .catch((error) => {
        toast.error("Gửi email thất bại. Vui lòng thử lại.");
      });
  };

  const organizDate = selecterContract?.organizdate
    ? parse(selecterContract.organizdate, "dd/MM/yyyy HH:mm", new Date())
    : null;

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Tìm kiếm */}
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
            placeholder="Tìm kiếm"
            type="search"
            className="admin-input-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên hợp đồng</TableCell>
              <TableCell>Loại tiệc</TableCell>
              <TableCell>Tổng chi phí</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  Trạng thái hợp đồng
                  <ContractFilter
                    filterType="contract"
                    onApplyFilter={(status) => {
                      setSelectedContractStatus(status);
                    }}
                    onClearFilter={() => setSelectedContractStatus("")}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  Trạng thái thanh toán
                  <ContractFilter
                    filterType="payment"
                    onApplyFilter={(paymentStatus) => {
                      setSelectedPaymentStatus(paymentStatus);
                    }}
                    onClearFilter={() => setSelectedPaymentStatus("")}
                  />
                </Box>
              </TableCell>
              <TableCell>Ngày tổ chức</TableCell>
              <TableCell
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Nội dung contracts */}
          <TableBody>
            {filteredContracts.map((contract, index) => (
              <TableRow key={contract.contractId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contract.name}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(contract.totalcost)}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      color:
                        contract.status === "Completed"
                          ? "#28a745"
                          : contract.status === "Pending"
                          ? "#ffc107"
                          : contract.status === "Actived"
                          ? "#17a2b8"
                          : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {translateStatus(contract.status)}{" "}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    style={{
                      color:
                        contract.paymentstatus === "Paid"
                          ? "#28a745"
                          : contract.paymentstatus === "Prepay 50%"
                          ? "#ffc107"
                          : contract.paymentstatus === "Prepay 70%"
                          ? "#ff851b"
                          : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {translateStatus(contract.paymentstatus)}{" "}
                  </span>
                </TableCell>

                <TableCell>
                  {contract.organizdate
                    ? format(
                        parse(
                          contract.organizdate,
                          "dd/MM/yyyy HH:mm",
                          new Date()
                        ),
                        "dd/MM/yyyy"
                      )
                    : "Không có ngày tổ chức"}
                </TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "nowrap",
                    position: "sticky",
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {contract.status !== "Completed" &&
                    contract.status !== "Đã hủy" && (
                      <span>
                        <Button
                          variant="outlined"
                          onClick={() => handleConfirmContract(contract)}
                          sx={{
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            color: "#33CC33",
                            borderRadius: "8px",
                            transition: "all 0.3s ease-in-out",
                            marginRight: "8px",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #FFFFFF 30%, #CCFFCC 90%)",
                            },
                          }}
                        >
                          <Tooltip
                            title={
                              <span style={{ fontSize: "1.25rem" }}>
                                Xác nhận hợp đồng
                              </span>
                            }
                            placement="top"
                          >
                            <CheckCircleIcon />
                          </Tooltip>
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => handleCancelContract(contract)}
                          sx={{
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            borderColor: "#f44336",
                            color: "#f44336",
                            borderRadius: "8px",
                            transition: "all 0.3s ease-in-out",
                            marginRight: "8px",
                            "&:hover": {
                              backgroundColor: "#fdecea",
                              borderColor: "#d32f2f",
                            },
                          }}
                        >
                          <Tooltip
                            title={
                              <span style={{ fontSize: "1.25rem" }}>
                                Hủy hợp đồng
                              </span>
                            }
                            placement="top"
                          >
                            <CancelIcon />
                          </Tooltip>
                        </Button>
                      </span>
                    )}
                  <Button
                    variant="outlined"
                    onClick={() => handleModalPDF(contract)}
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "primary",
                      borderRadius: "8px",
                      transition: "all 0.3s ease-in-out",
                      marginRight: "5px",
                      justifyContent: "center",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #FFFFFF 30%, #66CCFF 90%)",
                      },
                    }}
                  >
                    <Tooltip
                      title={
                        <span style={{ fontSize: "1.25rem" }}>
                          Xem thông tin
                        </span>
                      }
                      placement="top"
                    >
                      <InfoIcon />
                    </Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "1.2rem",
            padding: "16px",
            color: "#333",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "1.2rem",
              },
            "& .MuiTablePagination-actions > button": {
              fontSize: "1.2rem",
              margin: "0 8px",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "50%",
              padding: "8px",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            },
          }}
        />
      </TableContainer>
      {/* Hiển thị dialog hợp đồng */}
      <Dialog open={showModalPDF} onClose={handleCloseModal}>
        <DialogTitle sx={{ fontSize: "1.6rem", fontWeight: "bold" }}>
          Hợp Đồng Dịch Vụ
        </DialogTitle>

        <DialogContent
          className="custom-input"
          dividers
          sx={{ width: "600px" }}
        >
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
              Số hợp đồng:{" "}
              <strong>{selecterContract?.contractId || "..."}</strong>
            </p>

            <p style={{ marginTop: "20px" }}>
              Căn cứ Bộ luật Dân sự 2015 số 91/2015/QH13 và các văn bản hướng
              dẫn thi hành;
            </p>
            <p>
              Căn cứ nhu cầu và thỏa thuận giữa các bên, hôm nay, vào ngày{" "}
              <strong>{organizDate ? organizDate.getDate() : "..."}</strong>{" "}
              tháng{" "}
              <strong>
                {organizDate ? organizDate.getMonth() + 1 : "..."}
              </strong>{" "}
              năm{" "}
              <strong>{organizDate ? organizDate.getFullYear() : "..."}</strong>
              , tại trụ sở Công ty TNHH một thành viên L&P
            </p>

            <h3>
              Bên A:{" "}
              <strong>{selecterContract?.custname || "(Bên Thuê)"}</strong>
            </h3>
            <p>
              <strong>Địa chỉ trụ sở:</strong>{" "}
              {selecterContract?.Address ||
                "Số 4 Hai Bà Trưng, Tân An, Ninh Kiều, CT"}
            </p>
            <p>
              <strong>Mã số thuế:</strong>{" "}
              {selecterContract?.TaxCode || "888863453"}
            </p>
            <p>
              <strong>Đại diện là Ông/Bà:</strong>{" "}
              {selecterContract?.custname || "..."}
            </p>
            <p>
              <strong>Chức vụ:</strong>{" "}
              {selecterContract?.Position || "Giám đốc"}
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
              {selecterContract?.BankName || "TPBANK"}
            </p>
            <h3>
              Bên B: <strong>CÔNG TY TNHH 1 THÀNH VIÊN L&P</strong>
            </h3>
            <p>
              <strong>Số CMND/CCCD:</strong>{" "}
              {selecterContract?.IDCard || "123456789"}, cấp ngày 11 tại Cần Thơ
            </p>
            <p>
              <strong>Sinh ngày:</strong>{" "}
              {selecterContract?.dob || "01/01/1990"}
            </p>
            <p>
              <strong>Địa chỉ thường trú:</strong>{" "}
              {selecterContract?.Address ||
                "Hẻm 3, Trần Vĩnh Kiết, An Bình, CT"}
            </p>
            <p>
              <strong>Địa chỉ liên hệ:</strong>{" "}
              {selecterContract?.ContactAddress ||
                "Số 6, Hai Bà Trưng, Tân An, Ninh Kiều, Cần Thơ"}
            </p>

            <h3>Điều 1: Nội dung hợp đồng</h3>
            <p>
              Bên A <strong>{selecterContract?.custname}</strong> đồng ý thuê
              Bên B <strong>CÔNG TY TNHH 1 THÀNH VIÊN L&P</strong> cung cấp dịch
              vụ {selecterContract?.type || "dịch vụ"} tại địa điểm số{" "}
              <strong>
                {selecterContract?.locations?.locationId || "..."}
              </strong>{" "}
              vào ngày{" "}
              <strong>{organizDate ? organizDate.getDate() : "..."}</strong>
              {""}.
            </p>
            <p>Dịch vụ bao gồm: {selecterContract?.description || "..."}</p>

            <h3>Điều 2: Trách nhiệm và quyền lợi của các bên</h3>
            <p>
              - Bên A có trách nhiệm thanh toán đầy đủ cho Bên B theo tổng số
              tiền đã thoả thuận là{" "}
              <strong>{selecterContract?.totalcost || "..."}</strong>, và số
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
              <strong>Bên A:</strong> _______________________
            </p>
            <p>
              <strong>Bên B:</strong> _______________________
            </p>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            color="secondary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Đóng
          </Button>
          <Button
            variant="outlined"
            onClick={handleSavePDF}
            color="primary"
            sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Xuất PDF
          </Button>
          <Button
            variant="outlined"
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
