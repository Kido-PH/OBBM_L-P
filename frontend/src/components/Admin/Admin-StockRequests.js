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
} from "@mui/material";
import { stockRequests } from "../data";

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
      <TableContainer
        component={Paper}
        sx={{ mt: 1 }}
        className="table-container"
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell >RequestId</TableCell>
              <TableCell >ContractId</TableCell>
              <TableCell >IngredientId</TableCell>
              <TableCell >
                RequestedQuantity
              </TableCell>
              <TableCell >ApprovalStatus</TableCell>
              <TableCell >ReceivedDate</TableCell>
              <TableCell >RequestDate</TableCell>
              <TableCell >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.RequestId}>
                <TableCell >
                  {request.RequestId}
                </TableCell>
                <TableCell >
                  {request.ContractId}
                </TableCell>
                <TableCell >
                  {request.IngredientId}
                </TableCell>
                <TableCell >
                  {request.RequestedQuantity}
                </TableCell>
                <TableCell
                  sx={{
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
                <TableCell >
                  {request.ReceivedDate}
                </TableCell>
                <TableCell >
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
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontSize: "1rem" }}
                        onClick={() =>
                          handleApproval(request.RequestId, "Rejected")
                        }
                      >
                        Reject
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