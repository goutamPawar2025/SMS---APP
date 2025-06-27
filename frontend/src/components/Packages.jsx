import React from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';

const Package = ({ userId }) => {
  const handlePayment = async (amount, bulkMailCount) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/payments/create_order',
        {
          amount,
          user_id: userId,
        },
        { withCredentials: true }
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
            'http://localhost:3000/api/payments/verify',
            {
              order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              user_id: userId,
            },
            { withCredentials: true }
          );
          alert(verifyRes.data.message || 'Subscription Activated!');
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
    {
      name: 'Basic',
      price: 10000, 
      mails: 5,
    },
    {
      name: 'Standard',
      price: 300, // ₹300
      mails: 50,
    },
    {
      name: 'Premium',
      price: 500, // ₹500
      mails: 100,
    },
  ];

  return (
    <Navbar>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Choose Your Plan
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.name}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {pkg.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    ₹{pkg.price / 100}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    {pkg.mails} Bulk Emails
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handlePayment(pkg.price, pkg.mails)}
                  >
                    Buy {pkg.name}
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
