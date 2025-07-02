// ContactsAndCollections.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const ContactsAndCollections = () => {
  const [contacts, setContacts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [userId, setUserId] = useState(null);
  const [existingCollectionId, setExistingCollectionId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` };

          const [contactsRes, collectionsRes] = await Promise.all([
            axios.get(`http://localhost:3000/api/contacts?user_id=${userId}`, { headers }),
            axios.get(`http://localhost:3000/api/collections?user_id=${userId}`, { headers }),
          ]);

          setContacts(contactsRes.data);
          setCollections(collectionsRes.data);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    };
    fetchData();
  }, [userId, showModal]);

  const handleCollectionClick = async (collectionId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/collections/${collectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCollection(res.data);
    } catch (err) {
      console.error('Error fetching collection details:', err);
    }
  };

  const handleCheckboxChange = (contactId) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleCreateCollection = async () => {
    if (!collectionName || selectedContactIds.length === 0) {
      toast.error('Please enter a name and select contacts.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/collections',
        { name: collectionName, user_id: userId, contact_ids: selectedContactIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Collection created!');
      setShowModal(false);
      setCollectionName('');
      setSelectedContactIds([]);
    } catch (err) {
      console.error('Error creating collection:', err);
    }
  };

  const handleAddToExisting = async () => {
    if (!existingCollectionId || selectedContactIds.length === 0) {
      toast.error('Select a collection and contacts.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/collections/${existingCollectionId}`,
        { contact_ids: selectedContactIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Contacts added!');
      setSelectedContactIds([]);
      setExistingCollectionId('');
    } catch (err) {
      console.error('Error adding contacts:', err);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/collections/${collectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Collection deleted!');
      setCollections(collections.filter((col) => col.id !== collectionId));
      if (selectedCollection && selectedCollection.id === collectionId) {
        setSelectedCollection(null);
      }
    } catch (err) {
      console.error('Error deleting collection:', err);
      toast.error('Failed to delete collection.');
    }
  };

  const handleRemoveContactFromCollection = async (collectionId, contactId) => {
    if (!window.confirm('Remove this contact from the collection?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/contact/${collectionId}`,
        { contact_id: contactId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Contact removed!');
      // Update UI instantly:
      setSelectedCollection((prev) => ({
        ...prev,
        contacts: prev.contacts.filter((c) => c.id !== contactId),
      }));
    } catch (err) {
      console.error('Error removing contact:', err);
      toast.error('Failed to remove contact.');
    }
  };

  return (
    <Navbar>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Your Collections</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {collections.length === 0 ? (
            <p>No collections found.</p>
          ) : (
            collections.map((col) => (
              <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => handleCollectionClick(col.id)}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                  }}
                >
                  {col.name}
                </button>
                <button
                  onClick={() => handleDeleteCollection(col.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                  title="Delete Collection"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {selectedCollection && (
          <div style={{ marginTop: '30px', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
            <h3>Contacts in "{selectedCollection.name}"</h3>
            {selectedCollection.contacts.length === 0 ? (
              <p>No contacts found.</p>
            ) : (
              <ul style={{ marginTop: '10px' }}>
                {selectedCollection.contacts.map((c) => (
                  <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span>{c.email}</span>
                    <button
                      onClick={() => handleRemoveContactFromCollection(selectedCollection.id, c.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + Create New Collection
        </button>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            width: '400px',
            maxHeight: '80%',
            overflowY: 'auto',
          }}>
            <h3 style={{ marginBottom: '20px' }}>New Collection</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Collection Name:</label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>

            <label style={{ display: 'block', marginBottom: '5px' }}>Select Contacts:</label>
            <div style={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '4px',
              maxHeight: '150px',
              overflowY: 'auto',
            }}>
              {contacts.map((c) => (
                <div key={c.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedContactIds.includes(c.id)}
                      onChange={() => handleCheckboxChange(c.id)}
                    />{' '}
                    {c.email}
                  </label>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={handleCreateCollection}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCollectionName('');
                  setSelectedContactIds([]);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <hr style={{ margin: '40px 0' }} />

        <h3 style={{ marginBottom: '10px' }}>Add Contacts to Existing Collection</h3>
        <label>Select Existing Collection:</label>
        <select
          value={existingCollectionId}
          onChange={(e) => setExistingCollectionId(e.target.value)}
          style={{
            marginLeft: '10px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="">--Select--</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '10px',
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {contacts.map((c) => (
            <div key={c.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(c.id)}
                  onChange={() => handleCheckboxChange(c.id)}
                />{' '}
                {c.email}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddToExisting}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add to Collection
        </button>
      </div>
    </Navbar>
  );
};

export default ContactsAndCollections;
