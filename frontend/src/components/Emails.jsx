import axios from 'axios';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Chip,
  InputLabel,
  CircularProgress,
  Backdrop,
  Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetchCredits();
  }, []);


  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      if (!userId) return;
      const response = await axios.get(
        `http://localhost:3000/api/subscriptions/${userId}`
      );

      const activeSub = response.data.total_credits;
      setCredits(activeSub ? activeSub : 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleFileUpload = async () => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

    const data = new FormData();
    data.append('file', file);
    data.append('message', message);
    data.append('user_id', userId);



    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/emails/upload', data);
      setEmails(res.data.emails || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract emails!');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    if (credits === 0) {
      toast.error('Purchase credits to start sending bulk emails.');
      return;
    }

    if (emails.length > credits) {
      toast.error('Credits limit reached. Buy more to send more emails.');
      return;
    }

    try {
      setLoading(true);
       const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      const formData = new FormData();
      emails.forEach((email) => formData.append('emails[]', email));
      formData.append('message', message);
       formData.append('user_id', userId);

      const res = await axios.post('http://localhost:3000/emails/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Emails sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      setCredits(credits - emails.length);

      setEmails([]);
      setMessage('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send emails!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualEmail = () => {
    if (manualEmail && manualEmail.includes('@gmail.com')) {
      setEmails([...emails, manualEmail]);
      setManualEmail('');
    } else {
      toast.error('Please enter a valid Gmail address.');
    }
  };

  return (
    <Navbar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📧 Compose & Send Gmails
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={4}>
            Upload a CSV, add manually, and send personalized messages easily.
          </Typography>

          <Typography variant="body1" fontWeight="bold" mb={2}>
            Available Credits: {credits}
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <InputLabel sx={{ mb: 1 }}>Manual Gmail Entry</InputLabel>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="example@gmail.com"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddManualEmail}
                    >
                      Add
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <InputLabel sx={{ mb: 1 }}>Upload Gmail List (.csv)</InputLabel>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {file ? (
                      <Chip
                        label={file.name}
                        color="success"
                        onDelete={() => setFile(null)}
                        variant="outlined"
                      />
                    ) : (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                      >
                        Upload CSV
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile && !selectedFile.name.endsWith('.csv')) {
                              toast.error('Only .csv files are allowed');
                              e.target.value = null;
                              return;
                            }
                            setFile(selectedFile);
                          }}
                        />
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={!file}
                      onClick={handleFileUpload}
                    >
                      Extract Emails
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <InputLabel sx={{ mb: 1 }}>Compose Message</InputLabel>
                  <TextField
                    placeholder="Write your email content here..."
                    multiline
                    rows={6}
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                📬 Gmails Ready to Send:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  minHeight: 250,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#f9fafb',
                }}
              >
                {emails.length === 0 ? (
                  <Typography color="text.secondary">No emails added yet.</Typography>
                ) : (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {emails.map((email, idx) => (
                      <Chip
                        key={idx}
                        label={email}
                        color="info"
                        onDelete={() => {
                          setEmails(emails.filter((_, i) => i !== idx));
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              {credits === 0 && (
                <Typography color="error" mt={2}>
                  You have no credits left. Please purchase credits to start sending bulk emails.
                </Typography>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SendIcon />}
                  onClick={handleSendEmails}
                  disabled={emails.length === 0 || !message.trim() || credits === 0}
                >
                  Send Emails
                </Button>
                <Button variant="outlined" startIcon={<SaveIcon />}>
                  Save To Contacts
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <ToastContainer />
    </Navbar>
  );
}
