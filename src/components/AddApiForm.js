import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';

const AddApiForm = ({ onApiAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the new API data to the backend
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add`, formData)
      .then(response => {
        alert('API added successfully!');
        setFormData({ name: '', url: '', method: 'GET', description: '' });
        onApiAdded(); // Refresh the API list after adding
      })
      .catch(error => console.error('Error adding API:', error));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Add New API</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter API name"
          />
        </Form.Group>
        <Form.Group controlId="formUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            placeholder="Enter API URL"
          />
        </Form.Group>
        <Form.Group controlId="formMethod">
          <Form.Label>Method</Form.Label>
          <Form.Control
            as="select"
            name="method"
            value={formData.method}
            onChange={handleChange}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter API description"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add API
        </Button>
      </Form>
    </Container>
  );
};

export default AddApiForm;
