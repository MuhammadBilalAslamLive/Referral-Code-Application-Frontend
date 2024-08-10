import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import "./GetAllUsersReferalCodes.css";

const columns = [
  { id: "referralCodeID", label: "ReferralCode-ID", minWidth: 100, align: "center" },
  { id: "referralCode", label: "ReferralCode", minWidth: 100, align: "center" },
  { id: "assignedBy", label: "AssignedBy", minWidth: 100, align: "center" },
  { id: "assignedTo", label: "AssignedTo", minWidth: 100, align: "center" },
  { id: "status", label: "Current-Status", minWidth: 100, align: "center" },
];

function GetAllUsersReferalCodes() {
  const [referralCodes, setReferralCodes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    getReferralCodes();
  }, []);

  const getReferralCodes = async () => {
    setLoading(true); // Set loading to true before fetching
    const tokenObject = JSON.parse(localStorage.getItem("Token"));

    if (!tokenObject || !tokenObject.token) {
      console.error("No token found in local storage.");
      setLoading(false); // Set loading to false if no token
      return; 
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenObject.token}`,
      },
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/referral-codes/details`, requestOptions);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.referralCodes) {
        setReferralCodes(data.referralCodes);
      } else {
        console.warn("No referral codes found in the response.");
      }
    } catch (error) {
      console.error("Error fetching referral codes:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <div className="products-list">
        <h3>Referral Codes</h3>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {referralCodes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.referralCodeID}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={referralCodes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default GetAllUsersReferalCodes;
