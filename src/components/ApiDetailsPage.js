import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import necessary chart.js components
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const ApiDetailsPage = () => {
  const { id } = useParams(); // Get the API ID from the URL parameters
  const [apiDetails, setApiDetails] = useState(null);
  const [filteredVulns, setFilteredVulns] = useState(null); // Store filtered vulnerabilities
  const [riskData, setRiskData] = useState(null); // Store risk categories for the chart
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('pie'); // State for chart type

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const encodedId = encodeURIComponent(id); // Encode URL parameter
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/details/${encodedId}`);
        setApiDetails(response.data);

        // Collect data for chart visualization (risk categories)
        const riskCategories = response.data.reduce((acc, vuln) => {
          const risk = vuln.risk || 'Not specified';
          acc[risk] = (acc[risk] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for charts
        const labels = Object.keys(riskCategories);
        const data = Object.values(riskCategories);
        setRiskData({
          labels,
          datasets: [
            {
              label: 'Vulnerabilities by Risk',
              data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
              borderColor: '#000',
              borderWidth: 1,
            },
          ],
        });

        // Set initial filtered vulnerabilities
        setFilteredVulns(response.data);

        console.log('API details:', response.data);
      } catch (error) {
        console.error('Error fetching API details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiDetails();
  }, [id]);

  // Handle chart click events
  const handleChartClick = (event) => {
    const chart = event.chart;

    // Get the active elements
    const elements = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true);

    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedRisk = riskData.labels[index];

      if (selectedRisk === 'Not specified') {
        setFilteredVulns(apiDetails);
      } else {
        const filtered = apiDetails.filter(vuln => vuln.risk === selectedRisk);
        setFilteredVulns(filtered);
      }
      console.log('Filtered vulnerabilities:', filteredVulns);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!apiDetails) return <p>API not found.</p>;

  return (
    <Container className="mt-4">
      <h1 className="mb-4">API Details</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Domain</Card.Title>
          <Card.Text>{id}</Card.Text>
        </Card.Body>
      </Card>

      {/* Toggle Button */}
      <div className="mb-4">
        <Button variant="primary" onClick={() => setChartType('pie')} className="me-2">Pie Chart</Button>
        <Button variant="secondary" onClick={() => setChartType('bar')}>Bar Chart</Button>
      </div>

      {/* Risk Category Chart */}
      {riskData && (
        <Row className="mb-4">
          <Col md={12} lg={8} className="mx-auto">
            <Card>
              <Card.Body>
                <Card.Title>Vulnerabilities by Risk Category</Card.Title>
                {chartType === 'pie' ? (
                  <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%', marginLeft: '25%' }}>
                    <Pie 
                      data={riskData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                              }
                            }
                          }
                        },
                        onClick: handleChartClick
                      }} 
                    />
                  </div>
                ) : (
                  <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
                    <Bar
                      data={riskData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                              }
                            }
                          }
                        },
                        onClick: handleChartClick
                      }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <h2 className="mb-4">Vulnerabilities</h2>
      {filteredVulns && filteredVulns.length > 0 ? (
        <ListGroup>
          {filteredVulns.map((vuln) => (
            <ListGroup.Item key={vuln.id}>
              <h4>{vuln.name}</h4>
              <p><strong>Description:</strong> {vuln.description || 'No description available'}</p>
              <p><strong>Risk:</strong> {vuln.risk || 'Not specified'}</p>
              <p><strong>URL:</strong> {vuln.url ? <a href={vuln.url} target="_blank" rel="noopener noreferrer">{vuln.url}</a> : 'No URL available'}</p>
              <p><strong>Reference:</strong> {vuln.reference ? <a href={vuln.reference} target="_blank" rel="noopener noreferrer">{vuln.reference}</a> : 'No reference available'}</p>
              <p><strong>Solution:</strong> {vuln.solution || 'No solution available'}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No vulnerabilities found.</p>
      )}
    </Container>
  );
};

export default ApiDetailsPage;
