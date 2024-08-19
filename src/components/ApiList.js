import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import '../styles.css';
const ApiList = () => {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/list`);
        setApis(response.data);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };

    fetchApis();

    // Set up WebSocket connection
    // const ws = new WebSocket('ws://localhost:8082');
    // ws.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   if (message.type === 'NEW_API') {
    //     setApis(prevApis => [message.api, ...prevApis]);
    //   }
    // };

    // return () => {
    //   ws.close();
    // };
  }, []);

  const handleScan = async (apiId) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/scan/${apiId}`);
      alert('Scanning started!');
      // Optionally, refresh the API list to show updated scan results
      const updatedApis = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/list`);
      setApis(updatedApis.data);
    } catch (error) {
      console.error('Error initiating scan:', error);
      alert('Failed to start scan.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>API Inventory</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Method</th>
            <th>Description</th>
            <th>Last Scanned</th>
            <th>Vulnerabilities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.map(api => (
            <tr key={api._id}>
              <td>{api.name}</td>
              <td>{api.url}</td>
              <td>{api.method}</td>
              <td>{api.description || 'N/A'}</td>
              <td>{api.lastScanned ? new Date(api.lastScanned).toLocaleString() : 'Not Scanned'}</td>
              <td>
                {api.vulnerabilities && api.vulnerabilities.length > 0 
                  ? [...new Set(api.vulnerabilities)].join(', ')
                  : 'None'}
              </td>
              <td className="actions-column">
                <Button variant="primary" onClick={() => handleScan(api._id)}>
                  Scan
                </Button>
                <Link to={`/api/${encodeURIComponent(api.url)}`} className="btn btn-info ml-5">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApiList;
