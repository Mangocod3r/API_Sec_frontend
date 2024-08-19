import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ApiList from './components/ApiList';
import AddApiForm from './components/AddApiForm';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
// import VulnerabilitiesPage from './VulnerabilitiesPage';
import ApiDetailsPage from './components/ApiDetailsPage'; // Import the new component
const App = () => {
  const [apiListRefresh, setApiListRefresh] = useState(false);

  const handleApiAdded = () => {
    setApiListRefresh(!apiListRefresh); // Trigger re-fetching of API list
  };

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={
      <div>
        <AddApiForm onApiAdded={handleApiAdded} />
        <ApiList key={apiListRefresh} />
      </div>
    } />
    <Route path="/api/:id" element={<ApiDetailsPage />} /> {/* Route for API details */}
    {/* Add more routes as needed */}
  </Routes>
  </BrowserRouter>
  );
};

export default App;
