import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import PrivateComponent from './components/Login/PrivateComponent';
import AdminDashboard from './components/AdminDashBoard/AdminDashboard'; // Admin Dashboard Component
import UserDashboard from './components/UserDashBoard/UserDashboard'; // User Dashboard Component

function App() {
  const auth = JSON.parse(localStorage.getItem("Token")); // Get user authentication state

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Redirect from the root route based on authentication */}
          <Route 
            path='/' 
            element={auth ? <Navigate to={auth.role === 'admin' ? '/admin/all-referral-code' : '/user/referral-codes'} replace /> : <Navigate to="/login" />} 
          />

          {/* Admin Routes */}
          <Route element={<PrivateComponent role="admin" />}>
            <Route path='/admin/*' element={<AdminDashboard />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateComponent role="user" />}>
            <Route path='/user/*' element={<UserDashboard />} />
          </Route>

          {/* Public Routes */}
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
