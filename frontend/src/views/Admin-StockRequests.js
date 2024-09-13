import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { stockRequests } from "../components/data.js";

const ManageStockRequests = () => {
  const [requests, setRequests] = useState(stockRequests);

  const handleApproval = (requestId, status) => {
    const updatedRequests = requests.map((request) =>
      request.RequestId === requestId
        ? { ...request, ApprovalStatus: status }
        : request
    );
    setRequests(updatedRequests);
  };

  return (
    <div>
      {/* <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Quản Lý Yêu Cầu Nguyên Liệu
      </Typography> */}
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "90%", margin: "auto" }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "1.2rem" }}>RequestId</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>ContractId</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>IngredientId</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                RequestedQuantity
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>ApprovalStatus</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>ReceivedDate</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>RequestDate</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.RequestId}>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.RequestId}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.ContractId}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.IngredientId}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.RequestedQuantity}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    color:
                      request.ApprovalStatus === "Approved"
                        ? "green"
                        : request.ApprovalStatus === "Rejected"
                        ? "red"
                        : "inherit",
                  }}
                >
                  {request.ApprovalStatus}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.ReceivedDate}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {request.RequestDate}
                </TableCell>
                <TableCell>
                  {request.ApprovalStatus === "Pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "1rem", marginRight: 1 }}
                        onClick={() =>
                          handleApproval(request.RequestId, "Approved")
                        }
                      >
                        Xác Nhận
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontSize: "1rem" }}
                        onClick={() =>
                          handleApproval(request.RequestId, "Rejected")
                        }
                      >
                        Từ Chối
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageStockRequests;