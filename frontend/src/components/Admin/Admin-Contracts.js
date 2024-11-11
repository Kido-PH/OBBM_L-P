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
  IconButton,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import html2pdf from "html2pdf.js";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { format, parse } from "date-fns";
import ReactPaginate from "react-paginate";
import contractApi from "../../api/contractApi";

const ManageContracts = () => {
  const [contracts, setContracts] = useState([]); // Dữ liệu hợp đồng
  const [showModal, setShowModal] = useState(false); // Hiển thị modal

  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [showModalPDF, setShowModalPDF] = useState(false);
  const [selecterContract, setSelecterContract] = useState();
  const [page, setPage] = useState(1);
  const SIZE_CONTRACT = 5;
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzQxMzM3MDc4LCJpYXQiOjE3MzEzMzcwNzgsImp0aSI6ImJiMWU1OGM5LTU4OTEtNDBiOC05OTI3LTdmNzM2NzI2ZTMzZiIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.bOMQ8TIMtbQ-OlFC4yhmfApmMiuUykEqhxAJN-2Ll6LbKp5VrW4muMHRBZDqvIRoyRpz8H4IIQVSO0vRhG2LwQ";
    sessionStorage.setItem("token", token);

    fetchContractWithPaginate(page);
  }, [page]);

  // Hàm lấy tất cả listContract
  const fetchContractWithPaginate = async (page) => {
    try {
      const res = await contractApi.getPaginate(page, SIZE_CONTRACT);
      setContracts(res.result?.content);
      setPageCount(res.result?.totalPages);
      console.log(res.result?.content);
    } catch (error) {
      console.error("Không tìm nạp được danh mục: ", error);
    }
  };

  const handleConfirmContract = async () => {
    try {
      const data = {
        id: 11,
        name: "Hợp đồng Tiệc Tân Niên I",
        type: "Tiệc Tân Niên",
        guest: 80,
        table: 11,
        totalcost: 4500000,
        status: "Approved",
        paymentstatus: "Paid",
        organizdate: "2024-02-10T22:53:00", // Định dạng ISO 8601
        custname: "Trần Văn I",
        custphone: "0987654321",
        description: "Hợp đồng cho tiệc tân niên",
        userId: "U003",
        locationId: 1,
        eventId: 1,
        menuId: 1,
      };
  
      console.log("Dữ liệu gửi lên API:", data);
  
      // Gọi API PUT với ID trong URL
      await contractApi.update(data.id, data);
      toast.success("Hợp đồng đã được xác nhận thành công!");
    } catch (error) {
      console.error("Lỗi khi xác nhận hợp đồng:", error);
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
      }
      toast.error("Không thể xác nhận hợp đồng. Vui lòng thử lại sau!");
    }
  };
  

  // Hàm hủy hợp đồng
  const handleCancelContract = async (contract) => {
    try {
      const updateData = {
        ...contract,
        confirmationStatus: "Đã hủy",
      };

      // Gọi API POST để hủy hợp đồng
      await contractApi.update(contract.contractId, updateData);

      // Cập nhật danh sách hợp đồng trong state
      setContracts((prevContracts) =>
        prevContracts.map((item) =>
          item.contractId === contract.contractId
            ? { ...item, confirmationStatus: "Đã hủy" }
            : item
        )
      );

      toast.success("Hợp đồng đã được hủy thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy hợp đồng:", error);
      toast.error("Không thể hủy hợp đồng. Vui lòng thử lại sau!");
    }
  };

  // Hàm xử lý phân trang
  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setPage(selectedPage);
    console.log(`User requested page number ${event.selected}`);
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

  const handleSavePDF = () => {
    const contractContent = document.getElementById("contract-content");
    html2pdf().from(contractContent).save();
  };

  const handleSendMail = () => {
    const emailTo = selecterContract.CustomerEmail;

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
        console.log("Email sent successfully:", response.data);
        toast.success("Email đã được gửi thành công!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast.error("Gửi email thất bại. Vui lòng thử lại.");
      });
  };

  const organizDate = selecterContract?.organizdate
    ? parse(selecterContract.organizdate, "dd/MM/yyyy HH:mm", new Date())
    : null;

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
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
                          ? "#28a745" // Màu xanh lá cho trạng thái "Completed"
                          : contract.status === "Approved"
                          ? "#ffc107" // Màu vàng cho trạng thái "Approved"
                          : "#17a2b8", // Màu xanh dương cho trạng thái "Pending"
                      fontWeight: "bold",
                    }}
                  >
                    {contract.status}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    style={{
                      color:
                        contract.paymentstatus === "Paid"
                          ? "#28a745"
                          : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {contract.paymentstatus}
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
                <TableCell>{contract.description}</TableCell>
                <TableCell>{contract.custname}</TableCell>
                <TableCell>{contract.custphone}</TableCell>
                <TableCell>{contract.custmail}</TableCell>
                <TableCell sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
                  <IconButton
                    color="success"
                    onClick={() => handleConfirmContract(contract)}
                  >
                    <CheckCircleIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleCancelContract(contract)}
                  >
                    <CancelIcon />
                  </IconButton>

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
            <hr></hr>
            <h3>
              Bên B: <strong>CÔNG TY TNHH 1 THÀNH VIÊN L&P</strong>
            </h3>
            <p>
              <strong>Số CMND/CCCD:</strong>{" "}
              {selecterContract?.IDCard || "123456789"}, cấp ngày 11 tại Cần Thơ
            </p>
            <p>
              <strong>Sinh ngày:</strong>{" "}
              {selecterContract?.Birthday || "01/01/1990"}
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
              vụ {selecterContract?.ContractType || "dịch vụ"} tại địa điểm số
              {""}
              <strong>{selecterContract?.LocationId || "..."}</strong> vào ngày
              {""}
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
