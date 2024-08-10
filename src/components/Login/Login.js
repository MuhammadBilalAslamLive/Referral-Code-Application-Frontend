import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'; // Import Axios
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify

const theme = createTheme();

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("Token");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true); // Set loading to true
      try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password }, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          // Log the complete response for debugging
          console.log("Response:", response);
  
          const { status, message, role } = response.data; // Destructure response data
  
          // Handle error status
          if (status === "error") {
              toast.error(message || 'An error occurred.'); 
              return;
          }
  
          // Handle success status
          toast.success(message || 'User logged in successfully!'); // Show success message
          localStorage.setItem("Token", JSON.stringify(response.data)); // Store token
  
          // Navigate based on role
          navigate(role === "admin" ? '/admin/referral-codes' : '/user/referral-codes');
  
      } catch (error) {
          // Handle errors
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.'; // Use optional chaining
          toast.error(errorMessage); // Show error message from server
      } finally {
          setLoading(false); // Reset loading state
      }
  };
  

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword); // Toggle password visibility
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Loading...' : 'Login'} {/* Show loading text */}
                        </Button>
                        <Typography variant="body2">
                            Sign up free for {" "}
                            <Link to="/signup">Referral System</Link>
                        </Typography>
                    </Box>
                </Box>
                {/* Include Toast Container for notifications */}
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </Container>
        </ThemeProvider>
    );
}
