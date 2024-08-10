import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import GenerateReferralCode from './GenerateReferralCode/GenerateReferralCode';
import AssignReferralCode from './AssignReferralCode/AssignReferralCode';
import GetAllUsersReferalCodes from './GetAllRefferalCodes/GetAllUsersReferalCodes';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

function AdminDashboard() {
  return (
    <div>
      <Routes>
        <Route path='/referral-codes' element={<GetAllUsersReferalCodes />} />
        <Route path='/create-referral-code' element={<GenerateReferralCode />} />
        <Route path='/assign-referral-code' element={<AssignReferralCode />} />
        {/* <Route path='delete' element={<DeleteProduct />} />
        <Route path='profile' element={<Profile />} /> */}
      </Routes>
      <ToastContainer /> {/* Include ToastContainer here */}
    </div>
  );
}

export default AdminDashboard;
