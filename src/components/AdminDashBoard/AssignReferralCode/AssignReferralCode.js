import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

export default function AssignReferralCode() {
    const [referralCodes, setReferralCodes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedReferralCodeId, setSelectedReferralCodeId] = useState(""); // Changed to hold ID
    const [selectedUserId, setSelectedUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch unassigned referral codes and users on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenObject = JSON.parse(localStorage.getItem("Token"));
                if (!tokenObject || !tokenObject.token) {
                    toast.error("No token found. Please log in again.");
                    return; // Exit if no token is found
                }

                // Fetch unassigned referral codes
                const codesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getUnassignedReferralCodes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenObject.token}`,
                    },
                });

                const codesData = await codesResponse.json();
                if (codesData.status === "success") {
                    setReferralCodes(codesData.referralCodes);
                } else {
                    toast.error("Failed to fetch referral codes.");
                }

                // Fetch users
                const usersResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get-users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenObject.token}`,
                    },
                });

                const usersData = await usersResponse.json();
                if (usersData.status === "success") {
                    setUsers(usersData.users);
                } else {
                    toast.error("Failed to fetch users.");
                }
            } catch (error) {
                toast.error("Error fetching data.");
                console.error("Error:", error);
            } finally {
                setLoading(false); // Stop loading after data fetching
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedReferralCodeId || !selectedUserId) {
            toast.error("Please select both a referral code and a user.");
            return;
        }

        const tokenObject = JSON.parse(localStorage.getItem("Token"));
        if (!tokenObject || !tokenObject.token) {
            toast.error("No token found. Please log in again.");
            return; // Exit if no token is found
        }

        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/referral-code/assign`, {
                method: 'POST',
                body: JSON.stringify({
                    referralCodeId: selectedReferralCodeId, // Use the referralCodeId here
                    userId: selectedUserId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenObject.token}`, // Include the token here
                },
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Referral code assigned successfully!');
                navigate('/admin/referral-codes');
            } else {
                toast.error(result.message || "An error occurred.");
            }
        } catch (error) {
            toast.error("Failed to assign referral code. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Assign Referral Code
                    </Typography>
                    {loading ? (
                        <Typography>Loading...</Typography> // Loading indicator
                    ) : (
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                select
                                margin="normal"
                                fullWidth
                                id="_id"
                                label="Select Referral Code"
                                value={selectedReferralCodeId}
                                onChange={(e) => setSelectedReferralCodeId(e.target.value)} // Set referral code ID
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value=""></option>
                                {referralCodes.map((code) => (
                                    <option key={code._id} value={code._id}>
                                        {code.referralCode} {/* Display the referral code */}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                select
                                margin="normal"
                                fullWidth
                                id="user"
                                label="Select User"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)} // Set user ID
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value=""></option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.username} {/* Display the username */}
                                    </option>
                                ))}
                            </TextField>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 1, mb: 0 }}
                            >
                                Assign Code
                            </Button>
                        </Box>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}
