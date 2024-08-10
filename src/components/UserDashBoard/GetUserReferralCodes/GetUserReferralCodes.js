import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button"; // Import Button
import { useState, useEffect } from "react";
import "./GetUserRefferalCodes.css";

const columns = [
  { id: "referralCode_id", label: "ReferralCode-ID", minWidth: 100, align: "center" },
  { id: "referralCode", label: "ReferralCode", minWidth: 100, align: "center" },
  { id: "assignedBy", label: "AssignedBy", minWidth: 100, align: "center" },
  { id: "status", label: "Current-Status", minWidth: 100, align: "center" },
  { id: "useReferralCode", label: "Use-ReferralCode", minWidth: 100, align: "center" },
];

function GetUserReferralCodes() {
  const [referralcode, setReferralcode] = useState([]);
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

    console.log("JwtToken", tokenObject.token);
  
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenObject.token}`,
      },
    };
  
    try {
      let result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/referral-codes`, requestOptions);
      if (!result.ok) {
        throw new Error(`Network response was not ok: ${result.status} ${result.statusText}`);
      }
  
      const data = await result.json();
      console.log("result.referralCodes", data);
  
      if (data.referralCodes) {
        setReferralcode(data.referralCodes);
      } else {
        console.warn("No referral codes found in the response.");
      }
    } catch (error) {
      console.error("Error fetching referral codes:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleUseReferralCode = async (referralCodeId) => {
    const tokenObject = JSON.parse(localStorage.getItem("Token"));
    
    if (!tokenObject || !tokenObject.token) {
      console.error("No token found in local storage.");
      return; 
    }
    
    setLoading(true); // Set loading to true while updating
    const requestOptions = {
      method: "PATCH", // Change to PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenObject.token}`,
      },
      body: JSON.stringify({ status: "used" }), // Send updated status
    };

    try {
      let result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/use-referral-codes/${referralCodeId}`, requestOptions);
      if (!result.ok) {
        throw new Error(`Network response was not ok: ${result.status} ${result.statusText}`);
      }
      
      console.log("Referral code used successfully.");
      getReferralCodes(); // Refresh the products after updating
    } catch (error) {
      console.error("Error using referral code:", error);
    } finally {
      setLoading(false); // Set loading to false after updating
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
        <h3>Referral-Codes</h3>
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
            {referralcode
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.referralCode_id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "useReferralCode" ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleUseReferralCode(row.referralCode_id)}
                              disabled={row.status === "used" || loading} // Disable if used or loading
                            >
                              {row.status === "used" ? "Used" : "Use"}
                            </Button>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={referralcode.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default GetUserReferralCodes;
