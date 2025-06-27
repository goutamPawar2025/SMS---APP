// src/components/UploadCsv.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UploadCsv = () => {
  const [phones, setPhones] = useState([]);
  const [invalidPhones, setInvalidPhones] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:3000/api/contacts/import_csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPhones(res.data.phone_numbers || []);
      setInvalidPhones(res.data.invalid_numbers || []);
      setError('');
    } catch (err) {
      console.error('Upload failed:', err.message);
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Valid Indian Phone Numbers:</h3>
      <ul>
        {phones.map((num, i) => (
          <li key={i}>{num}</li>
        ))}
      </ul>

      {invalidPhones.length > 0 && (
        <>
          <h3 style={{ color: 'red' }}> Invalid / Non-Indian Numbers:</h3>
          <ul>
            {invalidPhones.map((num, i) => (
              <li key={i}>{num}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default UploadCsv;
