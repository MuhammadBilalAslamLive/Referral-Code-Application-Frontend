import { Routes, Route } from 'react-router-dom';
import GetUserReferralCodes from './GetUserReferralCodes/GetUserReferralCodes';

function UserDashboard() {
  return (
    <div>
      <Routes>
        <Route path='referral-codes' element={<GetUserReferralCodes/>}/>
      </Routes>
    </div>
  );
}

export default UserDashboard;
