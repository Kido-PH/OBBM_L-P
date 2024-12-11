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
  Autocomplete,
} from "@mui/material";
import toast from "react-hot-toast";
import { Divider } from "antd";
import eventserviceApi from "api/EventServiceApi";
import serviceApi from "api/serviceApi";

const EventDetailPopup = ({ open, handleClose, event }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [services, setServices] = useState([]); // Dịch vụ đã chọn
  const [availableServices, setAvailableServices] = useState([]); // Dịch vụ có sẵn từ backend
  const [tempServices, setTempServices] = useState([]); // Lưu các dịch vụ đã chọn tạm thời



  useEffect(() => {
    if (open && event?.eventId) {
      fetchService(event?.eventId);
    }
  }, [open, event]);

  // Lấy danh sách dịch vụ có sẵn
  useEffect(() => {
    const fetchAllService = async () => {
      try {
        const response = await serviceApi.getPaginate(1, 20);
        const services = response?.result?.content?.map((service) => ({
          ...service,
          selected: false, // Mặc định chưa chọn
        }));
        setAvailableServices(services || []); // Lưu vào state availableServices
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    fetchAllService();
  }, []);

  useEffect(() => {
    // Cập nhật danh sách dịch vụ khả dụng
    const updatedAvailableServices = availableServices.filter(
      (service) =>
        !services.some((s) => s.serviceId === service.serviceId)
    );
  
    setAvailableServices(updatedAvailableServices);
  }, [services, availableServices]);
  
  // Lấy danh sách dịch vụ cho sự kiện
  const fetchService = async (menuId, page, size) => {
    try {
      setLoading(true);
      const response = await eventserviceApi.getServicesByEvent(
        page + 1,
        size,
        menuId
      );
      if (response?.code === 1000) {
        setServices(
          response.result?.content.map((item) => ({
            ...item,
            eventId: item.events?.eventId,
            serviceName: item.services?.name,
          }))
        );
        setTotalElements(response.result?.totalElements || 0);
      } else {
        throw new Error("API trả về lỗi");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const page = 1; // Trang mặc định
      const size = 10; // Số lượng dịch vụ trên mỗi trang
      const menuId = event?.eventId; // ID của event hiện tại
  
      if (!menuId) {
        console.warn("Thiếu eventId, không thể tải danh sách dịch vụ.");
        return;
      }
  
      const response = await eventserviceApi.getServicesByEvent(page, size, menuId);
  
      if (response?.code !== 1000) {
        throw new Error("API trả về lỗi hoặc không có dữ liệu hợp lệ.");
      }
  
      const content = response.result?.content || [];
      console.log("Dữ liệu gốc từ API:", content);
  
      // Lọc dịch vụ đã xóa mềm
      const validServices = content.filter(
        (item) => !item.services?.deleted_at // Bỏ dịch vụ bị xóa mềm
      );
  
      // Danh sách hiển thị trên bảng
      const extractedServices = validServices.map((item) => ({
        serviceId: item.services?.serviceId || "unknown",
        name: item.services?.name || "Không xác định",
        price: item.services?.price || 0,
        quantity: item.quantity || 1,
        cost: item.cost || 0,
      }));
  
      // Danh sách Autocomplete (bao gồm cả dịch vụ đã xóa mềm)
      const removedServices = content.filter((item) => item.services?.deleted_at);
      const autoCompleteServices = [
        ...availableServices,
        ...removedServices.map((item) => ({
          serviceId: item.services?.serviceId,
          name: item.services?.name,
          price: item.services?.price,
          deleted_at: item.services?.deleted_at,
        })),
      ];
  
      setServices(extractedServices); // Cập nhật bảng
      setAvailableServices(autoCompleteServices); // Cập nhật Autocomplete
      setTotalElements(response.result?.totalElements || 0); // Cập nhật tổng số lượng
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error.message);
      toast.error("Không thể tải danh sách dịch vụ.");
    }
  };
  


  // Gọi khi component được mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Lưu danh sách dịch vụ đã chọn vào event
  const saveSelectedServices = async () => {
    try {
      const payload = services.map((service) => ({
        quantity: service.quantity || 1,
        cost: service.price,
        eventId: event?.eventId,
        serviceId: service.serviceId,
      }));

      if (payload.length > 0) {
        // Gửi từng yêu cầu thêm dịch vụ vào database
        await Promise.all(payload.map((data) => eventserviceApi.add(data)));
        toast.success("Lưu danh sách dịch vụ thành công!");
        fetchServices();
        handleClose();
     
      } else {
        toast.warning("Không có dịch vụ nào để lưu!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      toast.error("Không thể lưu dịch vụ.");
    }
  };

  // Hàm xử lý chọn dịch vụ từ Autocomplete
  const handleSelectService = (event, selectedServices) => {
    // Lọc các dịch vụ không bị trùng lặp trong bảng
    const newServices = selectedServices.filter(
      (selected) => !services.some((service) => service.serviceId === selected.serviceId)
    );

    // Cập nhật danh sách dịch vụ trong bảng và loại bỏ các dịch vụ trùng
    setServices((prevServices) => [...prevServices, ...newServices]);

    // Loại bỏ các dịch vụ vừa được chọn ra khỏi danh sách khả dụng
    const updatedAvailableServices = availableServices.filter(
      (service) => !newServices.some((s) => s.serviceId === service.serviceId)
    );

    setAvailableServices(updatedAvailableServices);
  };

  // Hàm xóa dịch vụ khỏi database
  const removeService = async (serviceId) => {
    try {
      // Gửi yêu cầu xóa dịch vụ từ database
      await eventserviceApi.delete(serviceId);

      // Lấy dịch vụ bị xóa ra khỏi bảng
      const removedService = services.find((service) => service.serviceId === serviceId);

      if (!removedService) return; // Nếu dịch vụ không tồn tại, thoát hàm

      // Cập nhật danh sách dịch vụ trong bảng
      setServices((prevServices) =>
        prevServices.filter((service) => service.serviceId !== serviceId)
      );

      // Thêm dịch vụ bị xóa vào danh sách khả dụng
      setAvailableServices((prevAvailableServices) => [
        ...prevAvailableServices,
        removedService,
      ]);

      toast.success("Xóa dịch vụ thành công.");
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
      toast.error("Không thể xóa dịch vụ.");
    }
  };

  // Giao diện nút Lưu
  const handleSave = () => {
    if (services.length > 0) {
      saveSelectedServices();
    } else {
      toast.warning("Không có dịch vụ nào để lưu!");
    }
  };


  // Thay đổi tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

            <Autocomplete
              multiple
              options={availableServices}
              getOptionLabel={(option) => option.name}
              value={services}
              onChange={handleSelectService}
              renderInput={(params) => (
                <TextField {...params} placeholder="Chọn dịch vụ" variant="outlined" fullWidth />
              )}
              isOptionEqualToValue={(option, value) => option.serviceId === value.serviceId}
              sx={{ marginBottom: 2 }}
            />
            {/* Bảng hiển thị danh sách dịch vụ đã chọn */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Tên dịch vụ
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Chi phí
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <TableRow key={service.serviceId}>
                      <TableCell sx={{ fontSize: "1.4rem" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontSize: "1.4rem" }}>{service.name}</TableCell>
                      <TableCell sx={{ fontSize: "1.4rem" }}>
                        {service.price.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => removeService(service.serviceId)} // Xóa dịch vụ
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: "center", fontSize: "1.3rem" }}>
                      Không có dịch vụ nào!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Đóng</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EventDetailPopup;