import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';

const CollectionsList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  // ✅ Fetch all collections for this user
  useEffect(() => {
    const fetchCollections = async () => {
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:3000/api/collections?user_id=${userId}`);
          setCollections(res.data);
        } catch (err) {
          console.error('Error fetching collections:', err);
        }
      }
    };
    fetchCollections();
  }, [userId]);

  // ✅ When user clicks a collection, fetch its contacts
  const handleCollectionClick = async (collectionId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/collections/${collectionId}`);
      setSelectedCollection(res.data);
      setContacts(res.data.contacts);
    } catch (err) {
      console.error('Error fetching collection details:', err);
    }
  };

  return (
    <Navbar>
      <div style={{ padding: '20px' }}>
        <h2>Your Collections</h2>

        {collections.length === 0 ? (
          <p style={{ color: 'red' }}>No collections found. Please create one.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {collections.map((col) => (
              <li key={col.id} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => handleCollectionClick(col.id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {col.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedCollection && (
          <div style={{ marginTop: '30px' }}>
            <h3>Contacts in "{selectedCollection.name}"</h3>
            {contacts.length === 0 ? (
              <p>No contacts found in this collection.</p>
            ) : (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>{contact.email}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default CollectionsList;
