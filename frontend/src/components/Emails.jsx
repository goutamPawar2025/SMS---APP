import axios from 'axios';
import { useState } from 'react';
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
  Backdrop
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';


export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    const data = new FormData();
    data.append('file', file);
    data.append('message', message);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/emails/upload', data);
      setEmails(res.data.emails || []);
    } catch (err) {
      console.error(err);
      alert('Failed to extract emails');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      emails.forEach((email) => formData.append('emails[]', email));
      formData.append('message', message);

      console.log("list of emails ", emails);
      console.log("Message ", message);

      const res = await axios.post('http://localhost:3000/emails/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
 
    toast.success('Emails sent successfully!', {
      position: 'top-right',
      autoClose: 3000,
      theme: 'colored',
    });
      setEmails([]);
      setMessage('');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to send emails!', {
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

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Compose Gmail Now!
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InputLabel>Manual Gmail Entry</InputLabel>
              <Box display="flex" gap={2} mb={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Gmail Address"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddManualEmail}>
                  <AddIcon /> ADD
                </Button>
              </Box>

              <Box display="flex" gap={2} mb={3} alignItems="center">
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
                          toast.error('Only .csv files are allowed')
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
                  onClick={handleFileUpload}
                  color="primary"
                  disabled={!file}
                >
                  Extract Emails
                </Button>
              </Box>

              <TextField
                label="Message"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Gmails to be sent:
              </Typography>
             <Paper variant="outlined" sx={{ minHeight: 200, p: 2 }}>
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
</Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button variant="contained" color="success" startIcon={<SendIcon />} onClick={handleSendEmails}>
                  Send Emails
                </Button>
                <Button variant="outlined" startIcon={<SaveIcon />}>
                  Save Draft
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Navbar>
  );
}
