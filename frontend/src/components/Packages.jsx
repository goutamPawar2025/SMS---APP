import React, { useMemo } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import * as jwt from 'jwt-decode'; // named import
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Package = () => {
  const userId = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwt.jwtDecode(token);
      return decoded.sub || decoded.user_id;
    } catch (error) {
      console.error('JWT Decode Error:', error);
      return null;
    }
  }, []);

  const handlePayment = async (amount, bulkMailCount, planName) => {
    if (!userId) {
      console.log("User Id is not present");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
     'http://localhost:3000/api/payments/create_order',
     { amount, user_id: userId },
     {
    headers: {
         Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
       },
       withCredentials: true,
    }
       );
      const { order_id, razorpay_key, currency } = res.data;

      const options = {
        key: razorpay_key,
        amount,
        currency,
        name: 'SMS Application',
        description: `Buy ${bulkMailCount} Bulk Mail Package`,
        order_id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            'http://localhost:3000/api/payments/verify_payment',
            {
              order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              user_id: userId,
              plan_name: planName.toLowerCase(),
            },
            { withCredentials: true }
          );

          toast.success(verifyRes.data.message || 'Subscription Activated!');
        },
        theme: {
          color: '#3399cc',
        },
      };


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Payment Failed');
    }
  };

  const packages = [
    { name: 'Basic', price: 10000, mails: 5 },
    { name: 'Standard', price: 30000, mails: 50 },
    { name: 'Premium', price: 50000, mails: 100 },
  ];

  return (
    <Navbar>
      <ToastContainer />
      <Box sx={{ p: 4, backgroundColor: '#121212', minHeight: '93vh' }}>
        <Typography variant="h4" gutterBottom align="center" color="white">
          Upgrade Your Plan
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {packages.map((pkg, index) => (
            <Grid item xs={15} sm={6} md={4} key={pkg.name}>
              <Card
                sx={{
                  borderRadius: 4,
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  border: index === 1 ? '1px solid #10a37f' : '1px solid #333',
                  boxShadow: index === 1 ? '0 0 20px rgba(16, 163, 127, 0.5)' : 'none',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom>
                    {pkg.name}
                  </Typography>
                  {index === 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: '#10a37f',
                        color: '#000',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '12px',
                      }}
                    >
                      Popular
                    </Typography>
                  )}
                  <Typography variant="h4" sx={{ my: 2 }}>
                    ₹{pkg.price / 100}
                  </Typography>
                  <Typography>{pkg.mails} Bulk Emails</Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: '#10a37f',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#0e8f6e',
                      },
                    }}
                    onClick={() =>
                      handlePayment(pkg.price, pkg.mails, pkg.name)
                    }
                  >
                    Get {pkg.name}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Navbar>
  );
};

export default Package;
