import React from 'react';
import './Footer.css';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
        Referral System Application
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


function Footer() {
  return (
    <div className='footer'>
           <h3>Referral System Application </h3>
           {/* <Copyright sx={{ mt: 0, mb: 1 }} /> */}
    </div>
  )
}

export default Footer