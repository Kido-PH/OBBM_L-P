import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  TablePagination,
  Checkbox,
} from "@mui/material";
import toast from "react-hot-toast";
import { Divider } from "antd";
import eventserviceApi from "api/EventServiceApi";
import serviceApi from "api/serviceApi";

const EventDetailPopup = ({ open, handleClose, event }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [service, setservice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [selectedService, setSelectedService] = useState([]);
  const [allServices, setAllServicess] = useState([]);
  const [services, setServices] = useState([]); // Dịch vụ đã chọn
  const [availableServices, setAvailableServices] = useState([]); // Dịch vụ có sẵn từ backend
  const [addServicePopupOpen, setAddServicePopupOpen] = useState(false); // Popup thêm dịch vụ
  const [updatedServices, setUpdatedServices] = useState([]); // Tạo state lưu dữ liệu tạm thời


  useEffect(() => {
    if (open && event?.eventId) {
      fetchService(event?.eventId, page, rowsPerPage);
      console.log("Event ID:", event?.eventId);
      console.log("Page:", page, "Rows per Page:", rowsPerPage);
    }
  }, [open, event, page, rowsPerPage]);

  useEffect(() => {
    const fetchAllService = async (page, size) => {
      try {
        const response = await serviceApi.getPaginate(1, 20);
        console.log("Dữ liệu API trả về:", response);
        const services = response?.result?.content?.map((service) => ({
          ...service,
          selected: false, // Mặc định chưa chọn
        }));
        setAvailableServices(services || []); // Lưu vào state availableServices
      } catch (error) {
        console.error("Lỗi khi lấy nguyên liệu:", error);
        toast.error("Không thể tải danh sách dịch vụ.");
      }
    };

    fetchAllService();
  }, []);

  const fetchService = async (eventId, page, size) => {
    try {
      setLoading(true); // Hiển thị loading
      const response = await eventserviceApi.getServicesByEvent(
        page + 1,
        size,
        eventId
      );
      console.log("API Response:", response);

      if (response?.code === 1000) {
        setservice(
          response.result.content.map((item) => ({
            ...item,
            eventId: item.events?.eventId,
            serviceName: item.services?.name,
          }))
        );
        setTotalElements(response.result.totalElements || 0);
      } else {
        throw new Error("API trả về lỗi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const saveSelectedServices = async () => {
    try {
      const payload = availableServices
        .filter((service) => service.selected)
        .map((service) => ({
          quantity: service.quantity || 1, // Đảm bảo có số lượng
          cost: service.price,
          eventId: event?.eventId,
          serviceId: service.serviceId,
        }));

      console.log("Payload gửi đi:", payload);

      if (payload.length > 0) {
        await Promise.all(payload.map((data) => eventserviceApi.add(data)));
        toast.success("Thêm dịch vụ thành công!");
        fetchService(event?.eventId, page, rowsPerPage); // Cập nhật lại danh sách dịch vụ
        setAddServicePopupOpen(false); // Đóng popup
      } else {
        toast.warning("Vui lòng chọn ít nhất một dịch vụ.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      toast.error("Không thể thêm dịch vụ.");
    }
  };

  const handleChangeQuantity = (serviceId, newQuantity) => {
    setUpdatedServices((prevServices) => {
      // Tìm dịch vụ có serviceId và cập nhật số lượng
      const updated = prevServices.map((service) =>
        service.serviceId === serviceId
          ? { ...service, quantity: newQuantity }
          : service
      );
      return updated;
    });
  };


const handleSaveQuantity = async (serviceId, newQuantity) => {
  const updatedService = services.find(
    (service) => service.serviceId === serviceId
  );

  if (!updatedService) {
    toast.error(`Không tìm thấy dịch vụ với ID: ${serviceId}`);
    return;
  }

  const updatedData = {
    eventId: event?.eventId,
    serviceId: updatedService?.serviceId,
    quantity: newQuantity,
    cost: updatedService?.price * newQuantity,
  };

  try {
    const response = await eventserviceApi.updateEventService(service?.serviceId ,updatedData);
    console.log("API Response:", response);
    toast.success("Cập nhật số lượng dịch vụ thành công!");

    // Sau khi cập nhật thành công từ API, update lại state services
    setServices((prev) =>
      prev.map((service) =>
        service.serviceId === serviceId
          ? { ...service, quantity: newQuantity, cost: updatedData.cost }
          : service
      )
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng dịch vụ:", error);
    toast.error("Không thể cập nhật số lượng dịch vụ.");
  }
};

  // Thay đổi tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectService = (serviceId) => {
    setAvailableServices((prev) =>
      prev.map((service) =>
        service.serviceId === serviceId
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  // const handleDeleteService = async (serviceId) => {
  //   try {
  //     // Gọi API để xóa dịch vụ bằng serviceId
  //     await eventserviceApi.delete(serviceId); // Gọi API delete với serviceId

  //     // Xóa dịch vụ khỏi state (cập nhật giao diện)
  //     setServices((prev) => prev.filter((service) => service.serviceId !== serviceId));

  //     toast.success("Dịch vụ đã được xóa!");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa dịch vụ:", error);
  //     toast.error("Không thể xóa dịch vụ.");
  //   }
  // };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          backgroundColor: "#f5f5f5",
          color: "#333",
          textAlign: "center",
        }}
      >
        Chi tiết sự kiện
      </DialogTitle>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #ddd",
          ".MuiTab-root": {
            fontSize: "1.3rem",
            fontWeight: "bold",
          },
        }}
      >
        <Tab label="Thông tin" />
        <Tab label="Dịch vụ" />
      </Tabs>
      <DialogContent
        dividers
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : activeTab === 0 ? (
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {event?.name}
            </Typography>
            <Divider />
            <Box
              display="flex"
              flexDirection="row"
              gap={4}
              mt={2}
              sx={{
                fontSize: "1.2rem",
                color: "#555",
              }}
            >
              <Box flex={1}>
                <img
                  src={event?.image}
                  alt={event?.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </Box>
              <Box flex={2} display="flex" flexDirection="column" gap={3}>
                <Typography sx={{ fontSize: "1.5rem" }}>
                  <strong>Mã sự kiện:</strong>{" "}
                  {event?.eventId || "Không xác định"}
                </Typography>
                <Typography sx={{ fontSize: "1.5rem" }}>
                  <strong>Tổng:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(event?.totalcost)}
                </Typography>
                <Typography sx={{ fontSize: "1.5rem" }}>
                  <strong>Mô tả:</strong>{" "}
                  {event?.description || "Không có mô tả"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.3rem", marginBottom: "16px" }}
              onClick={() => setAddServicePopupOpen(true)}
            >
              Thêm dịch vụ
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Tên dịch vụ
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Số lượng
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Chi phí
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {service.length > 0 ? (
    service.map((service, index) => (
      <TableRow key={service.serviceId}>
        <TableCell sx={{ fontSize: "1.4rem" }}>
          {index + 1}
        </TableCell>
        <TableCell sx={{ fontSize: "1.4rem" }}>
          {service.serviceName}
        </TableCell>
        <TableCell sx={{ fontSize: "1.4rem" }}>
        <TextField
            sx={{ fontSize: "1.4rem" }}
            size="small"
            type="number"
            value={service.quantity || 1}
            onChange={(e) =>
              handleChangeQuantity(service.serviceId, parseInt(e.target.value, 10))
            }
          />
        </TableCell>
        <TableCell sx={{ fontSize: "1.4rem" }}>
          {service.cost.toLocaleString()} VND
        </TableCell>
        <TableCell>
          <Button
            color="primary"
            onClick={() =>
              handleSaveQuantity(service.serviceId, updatedServices.find(s => s.serviceId === service.serviceId)?.quantity || service.quantity)
            }
          >
            Lưu
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={4}
        style={{ textAlign: "center", fontSize: "1.3rem" }}
      >
        Không có dữ liệu dịch vụ nào!
      </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[2, 5, 10]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    fontSize: "1.5rem",
                  },
                ".MuiTablePagination-actions button": {
                  fontSize: "2.5rem",
                  padding: "10px",
                },
              }}
            />
          </Box>
        )}

        {/* Dialog thêm dịch vụ */}
        <Dialog
          open={addServicePopupOpen}
          onClose={() => setAddServicePopupOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle variant="h4" fontWeight={"bold"}>
            Thêm dịch vụ
          </DialogTitle>
          <DialogContent dividers>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "17px", fontWeight:"bold" }}>Chọn</TableCell>
                  <TableCell style={{ fontSize: "17px", fontWeight:"bold" }}>Tên dịch vụ</TableCell>
                  <TableCell style={{ fontSize: "17px", fontWeight:"bold" }}>Chi phí</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableServices.length > 0 ? (
                  availableServices.map((service, index) => (
                    <TableRow key={service.serviceId}>
                      <TableCell style={{ fontSize: "15px" }}>
                        <Checkbox
                          checked={service.selected || false}
                          onChange={() =>
                            handleSelectService(service.serviceId)
                          }
                        />
                      </TableCell>
                      <TableCell style={{ fontSize: "15px" }}>{service.name}</TableCell>
                      <TableCell style={{ fontSize: "15px" }}>
                        {service.price.toLocaleString()} VND
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      Không có dịch vụ nào!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddServicePopupOpen(false)}
              sx={{ fontSize: "1.3rem" }}
              variant="outlined"
              color="secondary"
            >
              Hủy
            </Button>
            <Button
              onClick={saveSelectedServices}
              sx={{ fontSize: "1.3rem" }}
              variant="contained"
              color="primary"
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          color="secondary"
          sx={{ fontSize: "1.2rem" }}
        >
          Đóng
        </Button>
        <Button variant="contained" color="primary" sx={{ fontSize: "1.2rem" }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailPopup;
