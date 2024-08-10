import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

export default function GenerateReferralCode() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate the referral code length
        if (code.length !== 8) {
            toast.error("Referral code must be exactly 8 digits.");
            return;
        }

        const tokenObject = JSON.parse(localStorage.getItem("Token"));
        if (!tokenObject || !tokenObject.token) {
            toast.error("No token found. Please log in again.");
            return; // Exit if no token is found
        }

        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/create-referral-code`, {
                method: 'POST',
                body: JSON.stringify({ code }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenObject.token}`, // Include the token here
                },
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Referral code created successfully!');
                navigate('/admin/referral-codes');
            } else {
                toast.error(result.message || "An error occurred.");
            }
        } catch (error) {
            toast.error("Failed to create referral code. Please try again.");
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
                        Create New Referral Code
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="code"
                            label="Enter Code To Refer"
                            name="code"
                            required
                            autoFocus
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            inputProps={{ maxLength: 8 }} // Limit input length to 8 characters
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 1, mb: 0 }}
                        >
                            Generate Code
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
